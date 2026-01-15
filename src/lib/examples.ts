export const examplePlanJSON = `[
  {
    "Plan": {
      "Node Type": "Nested Loop",
      "Parallel Aware": false,
      "Join Type": "Inner",
      "Startup Cost": 0.71,
      "Total Cost": 24.78,
      "Plan Rows": 5,
      "Plan Width": 524,
      "Actual Startup Time": 0.089,
      "Actual Total Time": 245.234,
      "Actual Rows": 1,
      "Actual Loops": 1,
      "Plans": [
        {
          "Node Type": "Index Scan",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Scan Direction": "Forward",
          "Index Name": "users_pkey",
          "Relation Name": "users",
          "Alias": "u",
          "Startup Cost": 0.29,
          "Total Cost": 8.30,
          "Plan Rows": 1,
          "Plan Width": 262,
          "Actual Startup Time": 0.027,
          "Actual Total Time": 0.028,
          "Actual Rows": 1,
          "Actual Loops": 1,
          "Index Cond": "(id = 123)"
        },
        {
          "Node Type": "Seq Scan",
          "Parent Relationship": "Inner",
          "Parallel Aware": false,
          "Relation Name": "orders",
          "Alias": "o",
          "Startup Cost": 0.00,
          "Total Cost": 16.45,
          "Plan Rows": 5,
          "Plan Width": 262,
          "Actual Startup Time": 0.015,
          "Actual Total Time": 245.123,
          "Actual Rows": 1,
          "Actual Loops": 1,
          "Filter": "(user_id = 123)",
          "Rows Removed by Filter": 49999
        }
      ]
    },
    "Planning Time": 0.521,
    "Execution Time": 245.890
  }
]`;

export const examplePlanText = `Nested Loop  (cost=0.71..24.78 rows=5 width=524) (actual time=0.089..245.234 rows=1 loops=1)
  ->  Index Scan using users_pkey on users u  (cost=0.29..8.30 rows=1 width=262) (actual time=0.027..0.028 rows=1 loops=1)
        Index Cond: (id = 123)
  ->  Seq Scan on orders o  (cost=0.00..16.45 rows=5 width=262) (actual time=0.015..245.123 rows=1 loops=1)
        Filter: (user_id = 123)
        Rows Removed by Filter: 49999
Planning Time: 0.521 ms
Execution Time: 245.890 ms`;
