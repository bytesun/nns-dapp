
import 'package:dfinity_wallet/ui/_components/form_utils.dart';
import 'package:dfinity_wallet/ui/transaction/create_transaction_overlay.dart';

import '../../dfinity.dart';
import 'enter_cycles_page.dart';

class SelectCyclesOriginWidget extends StatelessWidget {
  final Canister destinationCanister;

  const SelectCyclesOriginWidget({Key? key, required this.destinationCanister}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Select Account",
                  style: context.textTheme.headline3,
                ),
                SmallFormDivider(),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    decoration: ShapeDecoration(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                            side: BorderSide(
                                width: 2, color: AppColors.gray800))),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: context.boxes.accounts.values
                          .mapToList((e) => _AccountRow(
                          account: e,
                          onPressed: () {
                            NewTransactionOverlay.of(context).pushPage(
                                "Enter ICP Amount",
                                EnterCyclesPage(
                                  origin: e,
                                  destinationCanister: destinationCanister,
                                ));
                          })),
                    ),
                  ),
                )
              ]),
        ),
      ),
    );
  }
}


class _AccountRow extends StatelessWidget {
  final Account account;
  final VoidCallback onPressed;
  final bool selected;

  const _AccountRow(
      {Key? key,
        required this.account,
        required this.onPressed,
        this.selected = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FlatButton(
      onPressed: onPressed,
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    account.name,
                    style: context.textTheme.headline3,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 16.0, bottom: 16.0, right: 16.0),
                  child: Text(
                    account.accountIdentifier,
                    style: context.textTheme.bodyText2,
                  ),
                )
              ],
            ),
          ),
          BalanceDisplayWidget(
              amount: account.balance.toBigInt.toICPT,
              amountSize: 30, icpLabelSize: 20)
        ],
      ),
    );
  }
}

