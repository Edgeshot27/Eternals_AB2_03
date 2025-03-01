

# AIsculapius: RAG-based Clinical Decision Support System (CDSS)

**Named after Asclepius, the Greek god of medicine, with an AI twist.**

ROUND 1 WORK
![image](https://github.com/user-attachments/assets/4f15e5f4-5088-42b7-a7d1-b933f6a011b6)


## Project Overview 
AIsculapius is a RAG-based Clinical Decision Support System (CDSS) designed to provide accurate, context-aware, and summarized answers to medical queries. It leverages the power of Qdrant (vector database), BioBERT-based query expansion, and AI-driven summarization using Grok LLM to deliver a comprehensive medical information resource.The support system further utilizes its resources for indvidual s

📊 Table of All Data Sources Integrated into Our RAG Pipeline
Data Source	Type	API / Method Used	Fields Stored in Qdrant	Category
PubMed	Research Papers	Entrez API	title, abstract, source	Research
ArXiv	Research Papers	ArXiv API	title, abstract, source	Research
bioRxiv	Preprint Papers	bioRxiv API	title, abstract, source	Research
FDA (Drugs & Treatments)	Medicines & Treatments	FDA API	title, abstract, source	Medicine
RxNorm	Drug Information	RxNorm API	title, abstract, source	Medicine
WHO Guidelines	Medical Guidelines	WHO Scraper	title, abstract, source	Research
MIMIC-IV (MIT EHR Database)	EHR Records	PostgreSQL Query	diagnosis, medications, clinical notes	EHR
Hugging Face (MedRAG Textbooks)	Medical Textbooks	datasets.load_dataset()	title, abstract, source	Educational


## Problem Statement

Navigating the vast landscape of medical literature is challenging for both healthcare professionals and patients. Traditional search methods often fail to capture the semantic nuances of medical queries. AIsculapius addresses this by combining keyword-based search with semantic vector search and AI summarization.

## Solution

Our solution provides a robust pipeline for clinical decion support system:

1.  **Data Ingestion:** Aggregates data from PubMed, WHO, FDA, ArXiv, TEXTBOOKS: 18 widely used medical textbooks, which are important references for students taking the United States Medical Licensing Examination (USLME), 
2.  **Query Processing:** Expands user queries using BioBERT and EHR-derived medical vocabulary, then performs hybrid retrieval.
3.  **AI Summarization:** Utilizes Grok LLM for concise summaries and BioBERT for Named Entity Recognition (NER).
4.  **Output Representation:** Delivers results via a chatbot interface with summaries, source links, and structured medical entities.
5.  **Evaluation & Refinement:** Continuously improves performance through evaluation metrics and user feedback. The Model undergoes periodic updates to update its Vector Database with New Research , Electronic Health Records , guidelines and Textbooks.

## Key Features

* **Hybrid Retrieval:** Combines BM25 (Elasticsearch) and vector search (Qdrant) for optimal results.
* **BioBERT-Powered Query Expansion:** Enhances query understanding with medical vocabulary.
* **AI-Driven Summarization:** Provides concise and relevant summaries using Grok LLM.
* **Named Entity Recognition:** Extracts medical conditions, drugs, and guidelines.
* **Chatbot Interface:** Facilitates user interaction and information delivery.
* **Comprehensive Data Sources:** Integrates data from reputable medical literature repositories.
* **Human-in-the-Loop:** Allows for review and validation of results. Further the query expansion allows the human to tune the query to his/her liking.
* **Evaluation Metrics:** Tracks performance using Precision@k, Recall@k, and MRR.

## Architecture




ROUND 2 WORK:
ROUND 2 Enhancements
![image](https://github.com/user-attachments/assets/56dadfbf-056e-4e72-aede-a64ca5ef1f75)

