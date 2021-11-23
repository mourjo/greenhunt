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


|                                             query                                              | precision | recall |
|------------------------------------------------------------------------------------------------|-----------|--------|
|                                             '1970'                                             |   0.32    |  0.32  |
|                                    'a visit to the library'                                    |   0.88    |  0.88  |
|                                     'academy awards 1992'                                      |   0.96    |  0.96  |
|                                     'alien star wars yoda'                                     |     1     |   1    |
|                                  'america washington france'                                   |   0.96    |  0.96  |
|                                   'award winner of the year'                                   |   0.92    |  0.92  |
|                                       'awful theme song'                                       |   0.92    |  0.92  |
|                                   'back story is compelling'                                   |   0.92    |  0.92  |
|                                     'best movies of 2000s'                                     |   0.44    |  0.44  |
|                                  'best thing I ever watched'                                   |   0.92    |  0.92  |
|                           'choreography cinematography photography'                            |   0.92    |  0.92  |
|                                        'clint eastwood'                                        |   0.96    |  0.96  |
|                                        'crime thriller'                                        |   0.88    |  0.88  |
|                            'direction and production and the cast'                             |   0.96    |  0.96  |
|                                     'github gitlab fitbit'                                     |    NaN    |  NaN   |
|                                  'Henri de Toulouse-Lautrec'                                   |   0.64    |  0.64  |
|                                  'highly rated comedy movies'                                  |   0.76    |  0.76  |
|                                            'horror'                                            |    0.8    |  0.8   |
| 'hostile environment makes his way to the apartment of Lucille before it can destroy the mole' |   0.92    |  0.92  |
|                                  'jet li stan lee bruce lee'                                   |     1     |   1    |
|                   'Judd Hirsch and Scott Cohen are great as father and son'                    |   0.96    |  0.96  |
|                                        'jurassic park'                                         |   0.96    |  0.96  |
|                                          'karate kid'                                          |   0.92    |  0.92  |
|                                    'live long and prosper'                                     |   0.84    |  0.84  |
|                                      'matrix revolutions'                                      |   0.92    |  0.92  |
|                                       'moments of humor'                                       |   0.96    |  0.96  |
|                                   'robert de niro al pacino'                                   |   0.96    |  0.96  |
|                                          'war story'                                           |   0.92    |  0.92  |
|                      'wars were common in the early days of civilization'                      |   0.92    |  0.92  |
|                                          'world war'                                           |     1     |   1    |
