# Query-Time Schema Fallback (QSF)

A browser-based experiment exploring how middleware can recover from incomplete product catalog data at query time instead of depending entirely on upstream feed validation.

**Live demo →**

## What it does

Real product catalogs are rarely complete. Some records arrive with missing or null attributes, which means perfectly relevant products can disappear from filtered search results simply because there's nothing to evaluate.

This experiment simulates an ecommerce search pipeline where an intermediate middleware layer detects missing attributes during query execution and attempts to resolve them using information already available in the product record.

Instead of modifying the source catalog, all enrichment happens at query time, allowing the original data to remain unchanged while producing more complete search results.

### Runtime schema recovery

Products missing required filter attributes are detected as the query executes. Rather than excluding those records immediately, the middleware evaluates other available fields to determine whether a reasonable fallback value can be inferred.

### Side-by-side comparison

The interface lets you compare standard filtering against Query-Time Schema Fallback to see exactly which products would normally disappear from search and how runtime resolution changes the result set.

### Transparent decision making

Every inferred attribute includes an explanation showing why the middleware reached its conclusion, making the fallback process observable instead of a black box.

## Stack

- Vanilla HTML, CSS, and JavaScript
- JSON-based product catalog
- Browser-based middleware simulation
- Runtime attribute inference and search filtering

## Architecture

The experiment models a simplified ecommerce search pipeline:

```
Catalog Feed
      │
      ▼
Query Middleware
      │
      ├── Detect missing attributes
      ├── Infer fallback values
      ├── Apply search filters
      └── Return enriched results
      │
      ▼
Search Results
```

The source catalog is never modified. Instead, the middleware evaluates missing attributes during query execution, applies fallback rules when appropriate, and returns the enriched result set while leaving the original data unchanged.

## Why I built this

I've worked with ecommerce product data long enough to know that upstream feeds are rarely perfect. Missing attributes, inconsistent schemas, and partially populated records are common, yet most search systems simply treat those records as non-matches.

I wanted to explore a different architectural approach: instead of requiring every catalog feed to be fully normalized before it reaches search, what if an intermediate query layer could recover gracefully from incomplete data at runtime?

This prototype is an exploration of that idea—a lightweight middleware layer that prioritizes resilient search behavior while leaving the underlying catalog untouched.
