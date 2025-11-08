## BillBuddy - AI-Powered Medical Bill Advocate

BillBuddy is a web application that leverages artificial intelligence to empower patients by analyzing their medical bills, accurately detecting common billing errors, and automatically generating professional dispute letters.

-----

### Key Features

  * **AI Bill Analysis:** Upload medical bills (PDF or image) and receive instant, comprehensive analysis powered by AI.
  * **Error Detection:** The system automatically identifies and flags critical billing issues, including:
      * Duplicate charges
      * Overcharges compared to standard benchmarks (e.g., Medicare rates)
      * Invalid or outdated billing codes (e.g., CPT, ICD-10)
      * Missing or insufficient documentation
  * **OCR Text Extraction:** Utilizes Tesseract.js for robust and accurate text extraction from uploaded image and PDF documents.
  * **Dispute Tools:** Streamlines the challenge process by auto-generating clear, professional dispute letters and email templates ready for submission.
  * **Savings Calculator:** Provides an immediate estimate of potential financial savings resulting from identified billing errors.
  * **Secure Data Storage:** All uploaded bills, analyses, and user data are stored securely using Supabase.

-----

### Technology Stack

  * **Frontend:** React.js, Tailwind CSS
  * **Backend & Database:** Supabase (PostgreSQL, Realtime, and Storage)
  * **Artificial Intelligence:** OpenAI GPT-4o-mini
  * **Optical Character Recognition (OCR):** Tesseract.js
  * **Authentication:** Supabase Auth
  * **Deployment (Planned):** Vercel

-----

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/maya-na1k/billbuddy.git
    cd billbuddy
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:** Create a file named `.env` in the project root and populate it with your credentials:

    ```
    REACT_APP_SUPABASE_URL=your_supabase_url
    REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
    REACT_APP_OPENAI_API_KEY=your_openai_api_key
    ```

4.  **Start the development server:**

    ```bash
    npm start
    ```

-----

### Usage Workflow

1.  **Sign Up:** Create a secure user account.
2.  **Upload:** Upload a medical bill in PDF or image format.
3.  **Analyze:** Wait for the AI analysis process (typically 30-60 seconds).
4.  **Review:** Examine the detected billing issues and the estimated potential savings.
5.  **Dispute:** Utilize the integrated tools to generate customized dispute letters or emails.
6.  **Send:** Download or copy the generated documents for submission to the billing department.

-----

### Addressing the Problem

The complexity and prevalence of medical billing errors are a significant financial burden, with studies suggesting errors affect up to 80% of medical bills. BillBuddy provides a scalable solution to this systemic problem by democratizing access to billing expertise:

  * It makes professional-grade bill analysis accessible to all patients.
  * It significantly reduces financial anxiety during and after medical events.
  * It empowers patients to confidently challenge erroneous or unfair charges.
  * It provides the necessary tools for professional disputes without the expense of a human advocate.

-----

### Database Schema Overview

The application utilizes a relational structure to manage all user and bill data:

  * `profiles`: Stores core user information.
  * `medical_bills`: Contains metadata for uploaded bills.
  * `bill_line_items`: Detailed individual charges extracted from the bills.
  * `bill_analyses`: Stores the results and findings of the AI analysis.
  * `dispute_documents`: Records generated dispute letters and templates.

-----

### Security Measures

Security and data privacy are paramount in BillBuddy:

  * **Row-Level Security (RLS):** Enabled across all database tables to ensure users can only access their own data.
  * **Secure File Storage:** Bills are stored securely with user-based access control policies.
  * **API Key Protection:** Sensitive API keys are managed using environment variables.
  * **Authentication:** All application features require user authentication.

-----

### Contributing

BillBuddy was initially developed as a hackathon project. We welcome and appreciate contributions from the open-source community to enhance its features and reliability.

### License

This project is licensed under the **MIT License**.

### Team Note

This application was built with a dedication to patient advocacy.

**Disclaimer:** This is a Minimum Viable Product (MVP) created for demonstration purposes. Users should always consider consulting with qualified healthcare professionals or certified billing experts for official legal or financial dispute actions.

-----
