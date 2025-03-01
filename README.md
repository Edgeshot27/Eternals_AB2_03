

# AIsculapius: Hybrid Medical Literature Retrieval System

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Issues](https://img.shields.io/github/issues/YOUR_USERNAME/AIsculapius)](https://github.com/YOUR_USERNAME/AIsculapius/issues)
[![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/AIsculapius)](https://github.com/YOUR_USERNAME/AIsculapius/stargazers)

**Named after Asclepius, the Greek god of medicine, with an AI twist.**

## Project Overview

AIsculapius is a hybrid medical literature retrieval system designed to provide accurate, context-aware, and summarized answers to medical queries. It leverages the power of Qdrant (vector database), BioBERT-based query expansion, and AI-driven summarization using Grok LLM to deliver a comprehensive medical information resource.

## Problem Statement

Navigating the vast landscape of medical literature is challenging for both healthcare professionals and patients. Traditional search methods often fail to capture the semantic nuances of medical queries. AIsculapius addresses this by combining keyword-based search with semantic vector search and AI summarization.

## Solution

Our solution provides a robust pipeline for medical literature retrieval:

1.  **Data Ingestion:** Aggregates data from PubMed, WHO, FDA, ArXiv, and BioRxiv.
2.  **Query Processing:** Expands user queries using BioBERT and EHR-derived medical vocabulary, then performs hybrid retrieval.
3.  **AI Summarization:** Utilizes Grok LLM for concise summaries and BioBERT for Named Entity Recognition (NER).
4.  **Output Representation:** Delivers results via a chatbot interface with summaries, source links, and structured medical entities.
5.  **Evaluation & Refinement:** Continuously improves performance through evaluation metrics and user feedback.

## Key Features

* **Hybrid Retrieval:** Combines BM25 (Elasticsearch) and vector search (Qdrant) for optimal results.
* **BioBERT-Powered Query Expansion:** Enhances query understanding with medical vocabulary.
* **AI-Driven Summarization:** Provides concise and relevant summaries using Grok LLM.
* **Named Entity Recognition:** Extracts medical conditions, drugs, and guidelines.
* **Chatbot Interface:** Facilitates user interaction and information delivery.
* **Comprehensive Data Sources:** Integrates data from reputable medical literature repositories.
* **Human-in-the-Loop (Optional):** Allows for review and validation of results.
* **Evaluation Metrics:** Tracks performance using Precision@k, Recall@k, and MRR.

## Architecture

```mermaid
graph TD
    A[Medical Literature Sources (PubMed, WHO, etc.)] --> B(Data Ingestion);
    B --> C{Qdrant & Elasticsearch};
    D[User Query] --> E(Query Processing & Expansion);
    E --> C;
    C --> F(Hybrid Retrieval);
    F --> G(AI Summarization & NER);
    G --> H(Grok LLM Summarization);
    G --> I(BioBERT NER);
    H --> J(Output Representation - Chatbot);
    I --> J;
    F --> J;
    J --> K(Evaluation & Refinement);
    K --> E;
