

# AIsculapius: RAG-based Clinical Decision Support System (CDSS)

**Named after Asclepius, the Greek god of medicine, with an AI twist.**

ROUND 1 WORK
![image](https://github.com/user-attachments/assets/4f15e5f4-5088-42b7-a7d1-b933f6a011b6)


## Project Overview
AIsculapius is a RAG-based Clinical Decision Support System (CDSS) designed to provide accurate, context-aware, and summarized answers to medical queries. It leverages the power of Qdrant (vector database), BioBERT-based query expansion, and AI-driven summarization using Grok LLM to deliver a comprehensive medical information resource.

## Problem Statement

Navigating the vast landscape of medical literature is challenging for both healthcare professionals and patients. Traditional search methods often fail to capture the semantic nuances of medical queries. AIsculapius addresses this by combining keyword-based search with semantic vector search and AI summarization.

## Solution

Our solution provides a robust pipeline for medical literature retrieval:

1.  **Data Ingestion:** Aggregates data from PubMed, WHO, FDA, ArXiv, TEXTBOOKS: 18 widely used medical textbooks, which are important references for students taking the United States Medical Licensing Examination (USLME), 
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




ROUND 2 WORK:
ROUND 2 Enhancements
![image](https://github.com/user-attachments/assets/56dadfbf-056e-4e72-aede-a64ca5ef1f75)

