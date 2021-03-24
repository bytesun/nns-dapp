import 'package:dfinity_wallet/data/auth_token.dart';
import 'package:dfinity_wallet/data/data.dart';
import 'package:dfinity_wallet/data/proposal.dart';
import 'package:dfinity_wallet/data/wallet.dart';
import 'package:dfinity_wallet/ui/home/landing_widget.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'hive_coordinator.dart';
import '../data.dart';
import 'package:dfinity_wallet/dfinity.dart';

class HiveLoader extends StatefulWidget {
  final HiveCoordinator hiveCoordinator;
  final Widget child;

  HiveLoader(
      {Key? key, required this.child, required this.hiveCoordinator})
      : super(key: key);

  static HiveLoader of(BuildContext context) {
    return context.findAncestorWidgetOfExactType<HiveLoader>()!;
  }

  @override
  _HiveLoaderState createState() => _HiveLoaderState();
}

class _HiveLoaderState extends State<HiveLoader> {
  bool fadingIn = false;
  bool animationCompleted = false;
  Duration animationDuration = 0.3.seconds;

  @override
  void initState() {
    super.initState();

    if(widget.hiveCoordinator.boxesClosed){
      widget.hiveCoordinator.openBoxes().then((value) async {
        if (mounted) {
          setState(() {
            fadingIn = true;
          });
        }
        await animationDuration.delay;
        if (!mounted) return;
        setState(() {
          animationCompleted = true;
        });
      });
    } else {
      fadingIn = false;
      animationCompleted = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        if (!widget.hiveCoordinator.boxesClosed && (fadingIn || animationCompleted))
          HiveBoxesWidget(
              child: widget.child,
              canisters: widget.hiveCoordinator.canisters!,
              wallets: widget.hiveCoordinator.wallets!,
              neurons: widget.hiveCoordinator.neurons!,
              authToken: widget.hiveCoordinator.authToken!,
              proposals: widget.hiveCoordinator.proposals!,),
        if (!animationCompleted || widget.hiveCoordinator.boxesClosed)
          IgnorePointer(
            child: AnimatedOpacity(
                duration: animationDuration,
                opacity: fadingIn ? 0 : 1,
                child: LandingPageWidget()),
          ),
      ],
    );
  }
}

class HiveBoxesWidget extends InheritedWidget {
  final Box<Canister> canisters;
  final Box<Wallet> wallets;
  final Box<AuthToken> authToken;
  final Box<Neuron> neurons;
  final Box<Proposal> proposals;

  const HiveBoxesWidget({
    Key? key,
    required Widget child,
    required this.canisters,
    required this.wallets,
    required this.authToken,
    required this.neurons,
    required this.proposals,
  })   : assert(child != null),
        super(key: key, child: child);

  static HiveBoxesWidget of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<HiveBoxesWidget>()!;
  }

  @override
  bool updateShouldNotify(HiveBoxesWidget old) {
    return false;
  }
}

extension BoxRetrieval on BuildContext {
  HiveBoxesWidget get boxes => HiveBoxesWidget.of(this);
}