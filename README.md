# greenhunt
A tiny toy project to rank search results using the [BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25) and comparing it to [Elasticsearch (ES)](https://www.elastic.co/what-is/elasticsearch).

# Running
Start running with: 

```shell
docker-compose up -d
npm install
npm start
```

# Results
The sample data set contains 50K documents containing movie descriptions and reviews. Both ES and the Store implemented in this project are searched with the same query and are asked to return the 10 most relevant documents. The following is the precision/recall of the Store compared to ES.

```
┌─────────┬────────────────────────────────────────────────────────────────────────────────────────────────┬───────────┬────────┐
│ (index) │                                             query                                              │ precision │ recall │
├─────────┼────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼────────┤
│    0    │                                             '1970'                                             │   0.84    │  0.84  │
│    1    │                                    'a visit to the library'                                    │   0.92    │  0.92  │
│    2    │                                     'academy awards 1992'                                      │   0.96    │  0.96  │
│    3    │                                     'alien star wars yoda'                                     │     1     │   1    │
│    4    │                                  'america washington france'                                   │   0.92    │  0.92  │
│    5    │                                   'award winner of the year'                                   │   0.84    │  0.84  │
│    6    │                                       'awful theme song'                                       │   0.96    │  0.96  │
│    7    │                                   'back story is compelling'                                   │     1     │   1    │
│    8    │                                     'best movies of 2000s'                                     │   0.76    │  0.76  │
│    9    │                                  'best thing I ever watched'                                   │   0.92    │  0.92  │
│   10    │                           'choreography cinematography photography'                            │     1     │   1    │
│   11    │                                        'clint eastwood'                                        │     1     │   1    │
│   12    │                                        'crime thriller'                                        │   0.96    │  0.96  │
│   13    │                            'direction and production and the cast'                             │   0.92    │  0.92  │
│   14    │                                     'github gitlab fitbit'                                     │    NaN    │  NaN   │
│   15    │                                  'Henri de Toulouse-Lautrec'                                   │   0.76    │  0.76  │
│   16    │                                  'highly rated comedy movies'                                  │   0.72    │  0.72  │
│   17    │                                            'horror'                                            │   0.84    │  0.84  │
│   18    │ 'hostile environment makes his way to the apartment of Lucille before it can destroy the mole' │     1     │   1    │
│   19    │                                  'jet li stan lee bruce lee'                                   │     1     │   1    │
│   20    │                   'Judd Hirsch and Scott Cohen are great as father and son'                    │   0.96    │  0.96  │
│   21    │                                        'jurassic park'                                         │   0.96    │  0.96  │
│   22    │                                          'karate kid'                                          │   0.88    │  0.88  │
│   23    │                                    'live long and prosper'                                     │   0.96    │  0.96  │
│   24    │                                      'matrix revolutions'                                      │     1     │   1    │
│   25    │                                       'moments of humor'                                       │   0.96    │  0.96  │
│   26    │                                   'robert de niro al pacino'                                   │   0.92    │  0.92  │
│   27    │                                  'ship sink iceberg atlantic'                                  │   0.96    │  0.96  │
│   28    │                                          'war story'                                           │   0.84    │  0.84  │
│   29    │                      'wars were common in the early days of civilization'                      │   0.88    │  0.88  │
│   30    │                                          'world war'                                           │   0.84    │  0.84  │
└─────────┴────────────────────────────────────────────────────────────────────────────────────────────────┴───────────┴────────┘
```