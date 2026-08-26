import io
import base64
import qrcode

class QRService:
    @staticmethod
    def generate_qr_data_uri(verification_url: str) -> str:
        """Generates a high-contrast, clean QR code data URI string for client rendering."""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=2,
        )
        qr.add_data(verification_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#07090e", back_color="#ffffff")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"
