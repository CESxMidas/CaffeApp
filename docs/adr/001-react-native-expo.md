# ADR-001: React Native + Expo for Mobile

**Status:** Accepted  
**Date:** 2026-06-25  
**Deciders:** Tech Lead

## Context

CaffeApp cần app mobile cho 3 vai trò (thu ngân, barista, quản lý) trên iOS và Android. Team có kinh nghiệm React/TypeScript.

## Decision

Sử dụng **React Native với Expo SDK 54** và **Expo Router** cho navigation.

**Versions (as of 2026-06-28):** Expo `~54.0.0`, React Native `0.81.5`, React `19.1.0`, expo-router `~6.0.24`.

## Alternatives Considered

| Option                  | Pros                        | Cons                                  |
| ----------------------- | --------------------------- | ------------------------------------- |
| **React Native + Expo** | Fast dev, OTA, TS ecosystem | Native module limits (acceptable MVP) |
| Flutter                 | Performance, UI consistency | Team learning curve Dart              |
| Native (Swift + Kotlin) | Best performance            | 2 codebases, slow MVP                 |
| PWA                     | No app store                | Poor tablet UX, no push reliable      |

## Consequences

**Positive:**

- Single codebase cho iOS + Android
- Expo EAS Build cho CI/CD
- Expo SecureStore cho JWT
- Fast iteration với Expo Go trong dev

**Negative:**

- Phụ thuộc Expo release cycle
- Bluetooth printer (post-MVP) cần dev client

## Compliance

- Aligns with NFR-08: iOS 15+, Android 10+
