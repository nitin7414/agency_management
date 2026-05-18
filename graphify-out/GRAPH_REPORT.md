# Graph Report - F:\projects\shri_shyam  (2026-05-18)

## Corpus Check
- 32 files · ~22,313 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 59 nodes · 45 edges · 22 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 8 edges
2. `POST()` - 6 edges
3. `PATCH()` - 5 edges
4. `getSession()` - 5 edges
5. `RootPage()` - 2 edges
6. `DELETE()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `RootPage()` --calls--> `getSession()`  [INFERRED]
  F:\projects\shri_shyam\app\page.tsx → F:\projects\shri_shyam\lib\session.ts
- `GET()` --calls--> `getSession()`  [INFERRED]
  F:\projects\shri_shyam\app\api\tasks\route.ts → F:\projects\shri_shyam\lib\session.ts
- `POST()` --calls--> `getSession()`  [INFERRED]
  F:\projects\shri_shyam\app\api\tasks\route.ts → F:\projects\shri_shyam\lib\session.ts
- `PATCH()` --calls--> `getSession()`  [INFERRED]
  F:\projects\shri_shyam\app\api\tasks\[id]\route.ts → F:\projects\shri_shyam\lib\session.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.31
Nodes (3): DELETE(), GET(), PATCH()

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (1): POST()

### Community 2 - "Community 2"
Cohesion: 0.5
Nodes (2): RootPage(), getSession()

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (0): 

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 10`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `seed.ts`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `HistoryPopup.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `uploadthing.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `uploadthing.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `Community 2` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 0` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getSession()` (e.g. with `RootPage()` and `POST()`) actually correct?**
  _`getSession()` has 4 INFERRED edges - model-reasoned connections that need verification._