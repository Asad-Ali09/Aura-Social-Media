import React from "react";
import { Container, Typography, Divider } from "@mui/material";
import { Shield } from "@mui/icons-material";

const PrivacyPolicy = () => {
  return (
    <Container sx={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy <Shield fontSize="large" sx={{ marginBottom: "-8px" }} />
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to AURA, a social media app dedicated to connecting people
        worldwide. Your privacy is important to us. This Privacy Policy explains
        how we collect, use, disclose, and safeguard your information when you
        use our services.
      </Typography>

      {/* Add more sections for each aspect of your privacy policy */}

      <Divider style={{ margin: "20px 0" }} />

      <Typography variant="h5" gutterBottom>
        Information We Collect
      </Typography>
      <Typography variant="body1" paragraph>
        We collect information you provide directly to us, such as your name,
        email address, and profile information. We may also collect information
        about your use of the app and interactions with other users.
      </Typography>

      {/* Add more content for each section of your privacy policy */}

      <Divider style={{ margin: "20px 0" }} />

      <Typography variant="h5" gutterBottom>
        How We Use Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We use the information we collect to provide, maintain, and improve our
        services, personalize your experience, and to respond to your inquiries
        and requests.
      </Typography>

      {/* Add more content for each section of your privacy policy */}

      {/* Add more sections as needed for your privacy policy */}

      <Divider style={{ margin: "20px 0" }} />

      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions or concerns about our Privacy Policy, please
        contact us at <strong>maasadali5433@gmail.com</strong>
      </Typography>

      {/* Add more content for each section of your privacy policy */}
    </Container>
  );
};

export default PrivacyPolicy;
