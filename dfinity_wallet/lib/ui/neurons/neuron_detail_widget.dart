import 'package:dfinity_wallet/ui/_components/footer_gradient_button.dart';
import 'package:dfinity_wallet/ui/_components/form_utils.dart';
import 'package:dfinity_wallet/ui/_components/overlay_base_widget.dart';
import 'package:dfinity_wallet/ui/transaction/create_transaction_overlay.dart';
import 'package:dfinity_wallet/ui/wallet/balance_display_widget.dart';

import '../../dfinity.dart';

class NeuronDetailWidget extends StatefulWidget {
  final int neuronIdentifier;

  const NeuronDetailWidget({Key? key, required this.neuronIdentifier}) : super(key: key);

  @override
  _NeuronDetailWidgetState createState() => _NeuronDetailWidgetState();
}

class _NeuronDetailWidgetState extends State<NeuronDetailWidget> {

  late Neuron neuron;
  OverlayEntry? _overlayEntry;


  @override
  void didChangeDependencies() {

    super.didChangeDependencies();
    neuron = context.boxes.neurons.get(widget.neuronIdentifier)!;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Neuron"),
      ),
      body: Container(
          color: AppColors.lightBackground,
          child: FooterGradientButton(
              body: ListView(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: _LabelledBalanceDisplay(label: "Stake", amount: neuron.balance,)
                      ),
                      Expanded(
                          child: _LabelledBalanceDisplay(label: "Reward", amount: neuron.rewardAmount,)
                      ),
                    ],
                  ),
                  Center(child: Padding(
                      padding: EdgeInsets.all(20),
                    child: Text(neuron.name.capitalize(), style: context.textTheme.headline2,),
                  )),
                  TallFormDivider(),
                  Card(
                    color: AppColors.black,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("Details", style: context.textTheme.headline3,),
                          SmallFormDivider(),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text("State: ${neuron.state.description}", style: context.textTheme.bodyText1),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text("Disperse Delay: ${neuron.durationRemaining.seconds.inDays} Days", style: context.textTheme.bodyText1),
                          ),
                          if(neuron.timerIsActive)
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text("Time Remaining: ${neuron.durationRemaining.seconds.inDays} Days", style: context.textTheme.bodyText1),
                            )
                        ],
                      ),
                    ),
                  )
                ],
              ),
              footer: SizedBox(
                width: double.infinity,
                height: 100,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Expanded(
                        child: buildStateButton(),
                      ),
                      SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton(
                            child: Text("Receive Reward"),
                            onPressed: () {
                              _overlayEntry = _createOverlayEntry();
                              Overlay.of(context)?.insert(_overlayEntry!);
                            }.takeIf((e) => neuron.rewardAmount > 0)),
                      ),
                    ],
                  ),
                ),
              ))),
    );
  }

  ElevatedButton buildStateButton() {
    switch(neuron.state){
      case NeuronState.DISPERSING:
        return ElevatedButton(
            child: Text("Stop Dispersing"),
            onPressed: () {
              setState(() {
                neuron.timerIsActive = false;
                neuron.save();
              });
            });
      case NeuronState.LOCKED:
        return ElevatedButton(
            child: Text("Start Dispersing"),
            onPressed: () {
              setState(() {
                neuron.timerIsActive = true;
                neuron.save();
              });
            });
      case NeuronState.UNLOCKED:
        return ElevatedButton(
            child: Text("Send ICP"),
            onPressed: () {

            });
    }
  }

  OverlayEntry _createOverlayEntry() {
    final parentContext = this.context;
    return OverlayEntry(builder: (context) {
      return OverlayBaseWidget(
          parentContext: parentContext,
          overlayEntry: _overlayEntry,
          child: NewTransactionOverlay(
            source: neuron,
          ));
    });
  }
}


class _LabelledBalanceDisplay extends StatelessWidget {

  final String label;
  final double amount;

  const _LabelledBalanceDisplay({Key? key, required this.label, required this.amount}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
          padding: EdgeInsets.all(24),
          child: Column(
            children: [
              Text(label),
              BalanceDisplayWidget(
                amount: amount,
                amountSize: 50,
                icpLabelSize: 25,
              ),
            ],
          )),
    );
  }
}