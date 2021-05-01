import 'dart:math';

import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';

import 'dfinity_entity.dart';

part 'canister.g.dart';

@HiveType(typeId: 102)
class Canister extends DfinityEntity{
    @HiveField(0)
    final String name;
    @HiveField(1)
    final String publicKey;
    @HiveField(2)
    DateTime? creationDate;
    @HiveField(3)
    int cyclesAdded = 0;
    @HiveField(4)
    String controller;

    int get cyclesSpent => creationDate!.difference(DateTime.now()).inSeconds;
    int get cyclesRemaining => max(0, cyclesAdded - DateTime.now().difference(creationDate!).inHours);

    Canister.demo(this.name, this.publicKey, this.controller){
        this.creationDate = DateTime.now();
        // final random = Random();
        // cyclesRemaining = random.nextInt(1000000);
        // cyclesSpent = random.nextInt(1000000);
    }

  @override
  String get identifier => publicKey;

    Canister(
    {required this.name,
    required this.publicKey,
    required this.creationDate,
    required this.cyclesAdded,
    required this.controller}
        );

}

