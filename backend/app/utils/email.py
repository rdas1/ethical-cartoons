import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = "ethicalcartoons@gmail.com"  # your verified sender

def send_email(to_email: str, subject: str, html_content: str):
    """
    Send an email using SendGrid.
    
    Args:
        to_email (str): Recipient's email address.
        subject (str): Subject of the email.
        html_content (str): HTML content of the email body.
    """
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"✅ Email sent to {to_email} | Status: {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

def send_verification_email(to_email: str, magic_link: str):
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject="Your Homework Access Link",
        html_content=f"""
        <p>Hello,</p>
        <p>Here is your link to access the homework:</p>
        <p><a href="{magic_link}">{magic_link}</a></p>
        <p>If you did not request this, you can ignore this email.</p>
        """
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"✅ Verification Email sent to {to_email} | Status: {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
