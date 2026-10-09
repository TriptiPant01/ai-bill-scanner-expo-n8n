## n8n Workflow Setup
1. In n8n, create a new workflow
2. Click ⋯ → Import from File → choose n8n/bill_scanner_workflow.json
3. Set your credentials:
   - Anthropic Chat Model → your Claude API key (sk-ant-api03-...)
   - Google Sheets → your Google account
4. In "Save to Google Sheets", select your own Sheet
   (headers: Scanned At, Shop, Bill No, Bill Date, Items, Total, Payment)
5. Publish the workflow and copy the Production webhook URL
6. Put that URL in your app's .env file