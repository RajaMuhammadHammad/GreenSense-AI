from flask import Flask, render_template, request, make_response
from xhtml2pdf import pisa
from io import BytesIO
from dotenv import load_dotenv
from PyPDF2 import PdfMerger
from datetime import datetime
import google.generativeai as genai
import os
import json
import re
import fitz  # PyMuPDF


import base64
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication


load_dotenv()
app = Flask(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route("/", methods=["GET"])
@app.route("/home", methods=["GET"])
def home():  # Changed from 'index' to 'home'
    return render_template("index.html")

@app.route("/chatbot", methods=["GET"])
def chatbot():
    return render_template("chatbot.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = json.loads(request.form["chat_data"])
    current_year = datetime.today().year

    prompt = f"""
You are a sustainability consultant.

Company Profile:
- Name: {data.get('company_name', 'N/A')}
- Region: {data.get('region', 'N/A')}
- Major Countries: {data.get('major_countries', 'N/A')}
- Sector & Industry: {data.get('sector_industry', 'N/A')}
- Size: {data.get('company_size', 'N/A')}
- Listing Status: {data.get('listing_status', 'N/A')}
- Certifications/Standards Aligned: {', '.join(data.get('global_standards', [])) or 'None'}


Climate & Emissions:
- Sustainability Strategy: {data.get('sustainability_strategy', 'N/A')}
- Net-zero/Science-based Targets: {data.get('netzero_targets', 'N/A')}
- Sustainability Officer: {data.get('sustainability_officer', 'N/A')}
- Emission Status: {data.get('emission_status', 'N/A')}
- Total GHG Emissions: {data.get('total_emissions', 'N/A')} tCO2e
- Monitoring Tools: {data.get('monitoring_tools', 'N/A')}

Energy:
- Renewable Energy %: {data.get('renewable_energy_use', 'N/A')}
- Energy Audit: {data.get('energy_audit', 'N/A')}
- Energy-saving Technologies: {', '.join(data.get('energy_tech', []))}
- Electrification Options: {', '.join(data.get('electrification_options', []))}

Waste & Circular Economy:
- Total Waste Generation: {data.get('waste_generation', 'N/A')} tonnes/year
- Waste Recycled: {data.get('waste_recycled', 'N/A')}
- Product Take-back Systems: {data.get('product_takeback', 'N/A')}

Infrastructure & Operations:
- Green Building Certifications: {data.get('green_buildings', 'N/A')}
- Tracking Systems Used: {', '.join(data.get('tracking_systems', []))}

Supply Chain:
- Supplier Disclosure: {data.get('supplier_disclosure', 'N/A')}
- Purchased Goods Carbon Impact: {data.get('purchased_goods_impact', 'N/A')}
- Procurement Policy: {data.get('sustainable_procurement', 'N/A')}

Water:
- Water-Stressed Areas: {data.get('water_stress_area', 'N/A')}
- Water Reuse Status: {data.get('water_reuse_status', 'N/A')}
- Water Measurement: {data.get('water_measurement', 'N/A')}
- Nature-Based Solutions: {', '.join(data.get('nature_based_solutions', []))}

People & Culture:
- ESG Training: {data.get('esg_training', 'N/A')}
- Staff Involvement in Green Projects: {data.get('staff_green_involvement', 'N/A')}

Risk & Strategy:
- Climate Risk Assessment: {data.get('climate_risk_assessment', 'N/A')}
- ESG Ratings: {', '.join(data.get('esg_ratings', []))}
- Top Sustainability Priorities (Next 2–3 years): {', '.join(data.get('sustainability_priorities', []))}



Now generate a sustainability report in **HTML**, using the following formatting:

- <h2> for section headings
- <h3> for subheadings (a, b, c, etc.)
- <p>, <ul>, <li>, and <div> for structure
- No title ("Sustainability Report") – it is added by the app


Report Sections:

1. Executive Summary
   a. Global and regional dynamics and the transformation vision  
   b. Key challenges  
   c. Strategic benefits and ROI outlook  
   d. Critical success factors and risks  
   e. Purpose of the report  

2. Strategic Roadmap: From Boardroom to Impact
   - Strategic Foundations  
   - Materiality Assessment  
   - Carbon Footprint Reduction Strategy  
   - Resource Efficiency  
   - Community and Stakeholder Engagement  

3. Building Competencies  
   - List of areas requiring skills development programs  

4. Recognition & Accreditation  
   - Mention ISO and other sustainability-related certifications  

5. Functional Capabilities  
   - Finance  
   - Procurement  
   - Operations  
   - HR  
   - Technology  

6. Digital Enablement for ESG  
   - ESG data architecture & analytics tools  
   - IoT for resource management  
   - AI for predictive ESG risk modeling  
   - Digital twin for environmental simulations  
   - Blockchain for traceability and supply chain ESG compliance

7. Phased Implementation Roadmap

Create a timeline using the following format:

Phase | Timeframe | Key Focus Areas  
------|-----------|------------------  

Output as an HTML table or styled content block suitable for PDF display.



   Make sure the HTML is readable, structured, and safe for PDF generation.

"""

    response = model.generate_content(prompt)
       
    cleaned_html = re.sub(r"```(?:html)?\s*", "", response.text, flags=re.IGNORECASE)
    cleaned_html = re.sub(r"```", "", cleaned_html).strip()

    return render_template("chatbot.html",
    response=cleaned_html,
    company_name=data.get('company_name', ''),
    region=data.get('region', ''),
    major_countries=data.get('major_countries', ''),
    sector_industry=data.get('sector_industry', ''),
    company_size=data.get('company_size', ''),
    listing_status=data.get('listing_status', ''),
    global_standards=', '.join(data.get('global_standards', [])),
)


@app.route("/download", methods=["POST"])
def download_pdf():
    html_content = request.form.get("response", "")
    company_name = request.form.get("company_name", "Company")
    region = request.form.get("region", "Unknown Region")
    today = datetime.today().strftime("%B %d, %Y")
    major_countries = request.form.get("major_countries", "N/A")
    sector_industry = request.form.get("sector_industry", "N/A")
    company_size = request.form.get("company_size", "N/A")
    listing_status = request.form.get("listing_status", "N/A")
    global_standards = request.form.get("global_standards", "N/A")
    client_email = request.form.get("client_email", "")  # ✅ collect email

    # Clean HTML
    html_content = re.sub(r"<h[1-7][^>]*>\s*.*?Sustainability Report.*?\s*</h[1-7]>", "", html_content, flags=re.IGNORECASE)
    html_content = re.sub(r"^\s*<div class='page-break'></div>", "", html_content, flags=re.IGNORECASE)

    section_titles = [
    "Executive Summary",
    "Strategic Roadmap: From Boardroom to Impact",
    "Building Competencies",
    "Recognition & Accreditation",   # <-- Problematic one
    "Functional Capabilities",
    "Digital Enablement for ESG",
    "Phased Implementation Roadmap"
]


    for i, title in enumerate(section_titles, start=1):
        pattern = rf"<h2>\s*{i}\.\s*{re.escape(title)}\s*</h2>"
        replacement = (
            f"<div class='page-break'></div>"
            f"<h2 style='color:#ffffff; background-color:#1a4d8f; padding:10px 15px; border-radius:8px 8px 0 0;'>"
            f"{i}. {title}</h2>"
        )
        html_content = re.sub(pattern, replacement, html_content, flags=re.IGNORECASE)

       # Fallback fix if heading 4 was not matched by regex (due to formatting issues)
    html_content = html_content.replace(
    "<h2>4. Recognition & Accreditation</h2>",
    "<div class='page-break'></div><h2 style='color:#ffffff; background-color:#1a4d8f; padding:10px 15px; border-radius:8px 8px 0 0;'>4. Recognition & Accreditation</h2>"
)
 

    company_profile_html = f"""
    <div class="company-profile">
        <h2 style='color:#ffffff; background-color:#1a4d8f; padding:10px 15px; border-radius:8px 8px 0 0;'>Company Profile</h2>
        <div class="section-box">
            <p><strong>Name:</strong> {company_name}</p>
            <p><strong>Region:</strong> {region}</p>
            <p><strong>Countries:</strong> {major_countries}</p>
            <p><strong>Sector & Industry:</strong> {sector_industry}</p>
            <p><strong>Size:</strong> {company_size}</p>
            <p><strong>Listing Status:</strong> {listing_status}</p>
            <p><strong>Certifications/Standards:</strong> {global_standards}</p>
            <p><strong>Date:</strong> {today}</p>
            <p style="font-size: 10pt; color: #555;">
                <strong>Disclaimer:</strong> This report is generated automatically using AI and provided data. Please review and verify the accuracy of the content before publishing or making business decisions.
            </p>
        </div>
    </div>
    """

    full_html = f"""
    <html>
    <head>
    <style>
        @page {{
            margin: 1in;
        }}
        body {{
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
        }}
        .company-info {{
            text-align: center;
            margin-top: 80px;
        }}
        .page-break {{
            page-break-before: always;
        }}
        h2 {{
            color: #ffffff;
            background-color: #1a4d8f;
            padding: 10px 15px;
            border-radius: 8px 8px 0 0;
            margin-top: 40px;
            margin-bottom: 0;
        }}
        h3 {{
            color: #000000 !important;
            font-size: 14pt;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
        }}
        .section-box {{
            background-color: #f4f9ff;
            border: 1px solid #cfdff4;
            border-top: none;
            border-radius: 0 0 8px 8px;
            padding: 15px 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }}
        p {{
            margin: 4px 0 6px 0;
            text-align: justify;
        }}
        ul {{
            margin-left: 20px;
        }}
        li {{
            margin-bottom: 6px;
        }}
    </style>
    </head>
    <body>

        <div class="company-info">
            <h1>{company_name} Sustainability Report</h1>
        </div>

        {company_profile_html}

        <div class="report-body">
            {html_content}
        </div>

    </body>
    </html>
    """

    # Step 1: HTML → PDF
    report_pdf_stream = BytesIO()
    pisa_status = pisa.CreatePDF(full_html, dest=report_pdf_stream)
    if pisa_status.err:
        return "PDF generation failed", 500
    report_pdf_stream.seek(0)

    # Step 2: Overlay on background template
    blank_template_path = "static/Template.pdf"
    if not os.path.exists(blank_template_path):
        return "Template not found", 404

    template_doc = fitz.open(blank_template_path)
    content_doc = fitz.open("pdf", report_pdf_stream.getvalue())
    final_pdf = fitz.open()

    # Optional: Cover page
    cover_path = "static/Cover.pdf"
    if os.path.exists(cover_path):
        cover_doc = fitz.open(cover_path)
        final_pdf.insert_pdf(cover_doc)

    # Main content pages with template background
    for i, page in enumerate(content_doc):
        bg_page = template_doc[0]
        new_page = final_pdf.new_page(width=bg_page.rect.width, height=bg_page.rect.height)
        new_page.show_pdf_page(bg_page.rect, template_doc, 0)
        new_page.show_pdf_page(bg_page.rect, content_doc, i)

    # Optional: Appendix
    appendix_path = "static/Details.pdf"
    if os.path.exists(appendix_path):
        appendix = fitz.open(appendix_path)
        final_pdf.insert_pdf(appendix)

    # Finalize PDF as bytes
    output = BytesIO()
    final_pdf.save(output)
    output.seek(0)
    pdf_bytes = output.getvalue()

    # ✅ Send via Email (if email provided)
    email_status = "not_provided"
    if client_email:
        try:
            from email.mime.multipart import MIMEMultipart
            from email.mime.application import MIMEApplication
            from email.mime.text import MIMEText
            import smtplib

            sender_email = os.getenv("EMAIL_SENDER")
            sender_password = os.getenv("EMAIL_PASSWORD")
            smtp_server = os.getenv("SMTP_SERVER")
            smtp_port = int(os.getenv("SMTP_PORT"))

            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = client_email
            message["Subject"] = "Your Sustainability Report"

            body = "Dear user,\n\nPlease find your sustainability report PDF attached.\n\nRegards,\nED Watch Team"
            message.attach(MIMEText(body, "plain"))

            part = MIMEApplication(pdf_bytes, _subtype="pdf")
            part.add_header("Content-Disposition", "attachment", filename=f"{company_name}_report.pdf")
            message.attach(part)

            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(message)

            email_status = "sent"
        except Exception as e:
            print("❌ Email sending failed:", e)
            email_status = "failed"

    # ✅ Return as direct download
    response = make_response(pdf_bytes)
    response.headers["Content-Disposition"] = f"attachment; filename={company_name}_sustainability_report.pdf"
    response.headers["Content-Type"] = "application/pdf"
    response.headers["X-Email-Status"] = email_status
    return response


def send_email_with_pdf(receiver_email, pdf_bytes):
    try:
        sender_email = os.getenv("EMAIL_SENDER")
        sender_password = os.getenv("EMAIL_PASSWORD")
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT"))

        # Create the email
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = "Your Sustainability Report (ED Watch)"
        msg.attach(MIMEText("Please find attached your sustainability report PDF.", 'plain'))

        # Attach PDF
        attachment = MIMEApplication(pdf_bytes, _subtype='pdf')
        attachment.add_header('Content-Disposition', 'attachment', filename="report.pdf")
        msg.attach(attachment)

        # Send the email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()

        print("✅ Email sent successfully.")
        return True

    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False


@app.route("/validate-email", methods=["POST"])
def validate_email():
    from requests import get

    email = request.json.get("email")
    if not email:
        return {"valid": False, "error": "Email is required"}, 400

    api_key = os.getenv("ABSTRACT_API_KEY")
    url = f"https://emailvalidation.abstractapi.com/v1/?api_key={api_key}&email={email}"

    try:
        response = get(url)
        result = response.json()

        is_deliverable = result.get("deliverability") == "DELIVERABLE"
        is_valid_format = result.get("is_valid_format", {}).get("value", False)

        return {"valid": is_deliverable and is_valid_format}
    except Exception as e:
        print("Email validation error:", e)
        return {"valid": False, "error": "Validation failed"}, 500


if __name__ == "__main__":
    app.run(debug=True)
