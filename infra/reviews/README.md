# Review Provider Sync

Use `POST /api/reviews/sync` to import review batches from Google or Facebook.

## Supported payload

See [provider-sync.example.json](provider-sync.example.json).

## Example curl

```bash
curl -X POST http://localhost:4000/api/reviews/sync \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  -d @infra/reviews/provider-sync.example.json
```

## Notes

- Reviews rated `>= 4` are auto-published unless `approved` is explicitly false.
- Reviews rated `<= 3` trigger review-alert automation and get an AI reply draft.
- Public reviews endpoint reads from cached approved/high-rated reviews first.
