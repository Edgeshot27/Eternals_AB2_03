

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

Our solution provides a robust clinical decion support system via TWO DIFFERENT CHAT ASSISTANTS :

1.  **Data Ingestion:**
    # A. MedBot (Research Assistant) uses medical_doc. Collection
    - Aggregates data from PubMed, WHO, FDA, ArXiv, TEXTBOOKS: 18 widely used medical textbooks, which are important references for students taking the United States Medical Licensing Examination (USLME),
    # B. Patient Interact uses clinic_abstract Collection
    - The Medical History , Medication , Health Status various such factors are passed on to the Bot to generate a Detailed Report regarding the Patient .The Report Covers details like Medical Adjustments, Theurapeutic Intervention , Dietary Changes, Monitoring Parameters and Follow Up, etc.
     Aggregates EHR(electronic health records), historical clinic notes , patient reports etc.

![image](https://github.com/user-attachments/assets/bf17c7a5-eb40-4af8-83f8-cebf5606c124) 

## Current Vector DB Status: 
**medical_docs Collection**: approx 30,000 Data Points : Retrieved from 8 different Sources 1,26,000 Book Records , 3000 Research Papers, Guidelines from PubMed,Arxiv,WHO etc.

**clinic abstract Collection**: approx 52000 points : Retrieved from different healthcare organizations.


![Screenshot 2025-03-08 220949](https://github.com/user-attachments/assets/9945b181-afcf-4d14-961a-6f0c2ccc1785)



2.  **Query Processing:** Expands user queries using BioBERT and EHR-derived medical vocabulary, then performs hybrid retrieval.
3.  **AI Summarization:** Utilizes Groq LPU for concise summaries and BioBERT for Named Entity Recognition (NER).
![image](https://github.com/user-attachments/assets/9b2db905-79db-4408-a4e2-766fa5e6b276)


4.  **Output Representation:** Delivers results via a chatbot interface with summaries, source links, and structured medical entities.
![WhatsApp Image 2025-03-02 at 09 26 23_731f4fef](https://github.com/user-attachments/assets/6ac10acb-91e9-4f1f-b904-29071f118f4f)
![WhatsApp Image 2025-03-09 at 10 46 01_52abf9a4](https://github.com/user-attachments/assets/acea87d7-bc62-4799-add2-613daefdf195)
![WhatsApp Image 2025-03-09 at 10 47 01_8e7bde46](https://github.com/user-attachments/assets/38c29f15-98e6-4843-b10b-ad1e89579a38)

6.  **Evaluation & Refinement:** Continuously improves performance through evaluation metrics and user feedback. The Model undergoes periodic updates to update its Vector Database with New Research , Electronic Health Records , guidelines and Textbooks.
 ![WhatsApp Image 2025-03-09 at 10 48 05_65753313](https://github.com/user-attachments/assets/e9f384ea-406b-4af1-a453-8e4c9589f408)


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


## ROUND 2 WORK:
![image](https://github.com/user-attachments/assets/43141be9-23d0-4047-be64-282e15662a8a)

![image](https://github.com/user-attachments/assets/28b8e4c1-8e42-4787-8d38-5ef73f492fda)


## Achievements in Round 2

- **Patient-Specific Evaluation System:** Integrated patient-specific analysis using historical EHR data, providing structured medical evaluation and personalized recommendations.  
- **Risk Level Classification with Color Coding:** Implemented risk scoring mechanism with Minor (Low Risk), Medium (Moderate Risk), and Critical (High Risk) levels displayed using color-coded indicators.  
- **Automated Email Alert System:** Developed automated alert mechanism using `yagmail` to send real-time alerts to critical patients via Gmail.  
- **Patient Chat Assistant Integration:** Enabled AI Chat Assistant to evaluate patient messages, assign risk levels, and trigger alerts for critical conditions.  
- **Improved Backend API:** Enhanced FastAPI backend for risk scoring, alert triggering, and non-blocking email alerts via background tasks.  

## Test Mail
![image](https://github.com/user-attachments/assets/f4e073e2-7557-4013-8d29-3113934da8eb)

### Installation:
NOTE- DB API URL AND KEY HAS BEEN REMOVED FROM THE CODE !!
Preferrably use the final-submission branch :
clone the project 

RUN FRONTEND-
cd frontend 
npm install
npm run dev

RUN BACKEND-
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
