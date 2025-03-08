

# AIsculapius: RAG-based Clinical Decision Support System (CDSS)

**Named after Asclepius, the Greek god of medicine, with an AI twist.**
![image](https://github.com/user-attachments/assets/4f15e5f4-5088-42b7-a7d1-b933f6a011b6)

## Problem Statement: AB2_03
Problem: Healthcare professionals face challenges accessing real-time, relevant medical information for decision-making due to fragmented data and evolving research. Existing systems struggle with patient-specific insights and cognitive overload from vast outdated literature. 
Traditional search methods often fail to capture the semantic nuances of medical queries.This leads to potential inaccuracies and inefficiencies in clinical decisions.

## Project Overview 
AIsculapius is a RAG-based Clinical Decision Support System (CDSS) designed to provide accurate, context-aware, and summarized answers to medical queries. It leverages the power of Qdrant (vector database),Hybrid (BM25 + Vector) Search, BioBERT-based query expansion, and AI-driven summarization using Groq LPU to deliver a comprehensive medical information resource.User queries trigger retrieval of relevant information, patient data integration, and AI-powered summarization. A chatbot interface delivers concise, evidence-based recommendations, with options for source document access and human oversight. Continuous evaluation and vector database updates ensure accuracy and relevance.

## ROUND 1 WORK
![image](https://github.com/user-attachments/assets/47ccbe14-f8e0-483a-8dc8-7d7996889bf0)

## Solution

Our solution provides a robust pipeline for clinical decion support system:

1.  **Data Ingestion:** Aggregates data from PubMed, WHO, FDA, ArXiv, TEXTBOOKS: 18 widely used medical textbooks, which are important references for students taking the United States Medical Licensing Examination (USLME), 

![image](https://github.com/user-attachments/assets/bf17c7a5-eb40-4af8-83f8-cebf5606c124) 

## Current Vector DB Status: approx 30,000 Data Points : Retrieved from 8 different Sources 1,26,000 Book Records , 3000 Research Papers, Guidelines from PubMed,Arxiv,WHO etc.
![Screenshot 2025-03-08 220949](https://github.com/user-attachments/assets/9945b181-afcf-4d14-961a-6f0c2ccc1785)



2.  **Query Processing:** Expands user queries using BioBERT and EHR-derived medical vocabulary, then performs hybrid retrieval.
3.  **AI Summarization:** Utilizes Groq LPU for concise summaries and BioBERT for Named Entity Recognition (NER).
![image](https://github.com/user-attachments/assets/9b2db905-79db-4408-a4e2-766fa5e6b276)


4.  **Output Representation:** Delivers results via a chatbot interface with summaries, source links, and structured medical entities.
![WhatsApp Image 2025-03-02 at 09 26 23_731f4fef](https://github.com/user-attachments/assets/6ac10acb-91e9-4f1f-b904-29071f118f4f)
![WhatsApp Image 2025-03-02 at 11 35 22_bf37ecc9](https://github.com/user-attachments/assets/e47f09f8-88a3-4fcd-bbf5-62439f0e462f)
![WhatsApp Image 2025-03-02 at 11 35 23_15535403](https://github.com/user-attachments/assets/01724c5e-d130-495a-9060-5989bbdb3c6e)

6.  **Evaluation & Refinement:** Continuously improves performance through evaluation metrics and user feedback. The Model undergoes periodic updates to update its Vector Database with New Research , Electronic Health Records , guidelines and Textbooks.

## Key Features

* **Hybrid Retrieval:** Combines BM25 (Elasticsearch) and vector search (Qdrant) for optimal results.
* **BioBERT-Powered Query Expansion:** Enhances query understanding with medical vocabulary.
* **AI-Driven Summarization:** Provides concise and relevant summaries using Grok LLM.
* **Named Entity Recognition:** Extracts medical conditions, drugs, and guidelines.
* **Chatbot Interface:** Facilitates user interaction and information delivery.
* **Comprehensive Data Sources:** Integrates data from reputable medical literature repositories.
* **Human-in-the-Loop:** Allows for review and validation of results. Further the query expansion allows the human to tune the query to his/her liking.
* **Evaluation Metrics:** Tracks performance using Reciprocal Rank Fusion (RRF)



## Architecture
![diagram-export-3-2-2025-1_47_42-AM](https://github.com/user-attachments/assets/5097d798-cb14-4695-8339-6b5f371fc4b9)


ROUND 2 WORK:
![image](https://github.com/user-attachments/assets/43141be9-23d0-4047-be64-282e15662a8a)

![image](https://github.com/user-attachments/assets/28b8e4c1-8e42-4787-8d38-5ef73f492fda)

All the above mentioned functionalities have been implemented.


