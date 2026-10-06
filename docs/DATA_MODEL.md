# Data Model

## Evidence
Immutable external observation.

## Opportunity
Commercial hypothesis backed by Evidence IDs.

## Offer
A monetizable product/service with verified economics.

## OfferMatch
Relationship between Opportunity and Offer with:
- fit score
- economics score
- evidence IDs
- risks
- verifiedAt

## AssetPlan
A minimum execution bundle with expected purpose and evidence.

## Experiment
A controlled action against an Opportunity.

## Outcome
Observed result from an Experiment.

## Learning
A structured update derived from Outcomes.

## Provenance rule

No numeric field that came from outside the system should exist without provenance metadata.

Recommended common metadata:

```
source
sourceUrl
capturedAt
confidence
evidenceId
```

## Freshness

Evidence has a freshness policy based on source type. Offer terms and prices expire faster than historical analytical observations.

Expired evidence may remain useful historically but must not be treated as current.
