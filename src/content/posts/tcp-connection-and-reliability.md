---
title: "TCP and Reliable Transmission"
series: network-protocols
order: 2
status: draft
---

## What TCP Is
- transport-layer protocol for reliable, ordered byte delivery between two endpoints
- distinguish TCP from HTTP: TCP moves bytes, HTTP defines application meaning
- mention connection-oriented behavior and why applications rely on it

## How a TCP Connection Starts
- three-way handshake: SYN, SYN-ACK, ACK
- both sides agree on initial sequence numbers
- connection state exists at both endpoints after the handshake

## How Reliability Works
- sequence numbers identify byte positions, not whole messages
- acknowledgments confirm which bytes arrived
- sender retransmits when ACKs do not arrive in time
- in-order delivery to the application even if packets arrive out of order

## Flow Control and Congestion Control
- flow control protects the receiver with the advertised window
- congestion control protects the network path
- explain that these solve different bottlenecks
- keep the explanation conceptual, not RFC-level exhaustive

## Example
- trace one small file download over TCP
- show handshake, data segments, ACKs, one lost segment, retransmission
- connect the example back to why higher-level protocols trust TCP

## Quiz
Topic: handshake steps, acknowledgments, retransmission, and the difference between flow control and congestion control
