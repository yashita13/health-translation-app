import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import gsap from "gsap";

export default function Dashboard() {
    const navigate = useNavigate();

    const contentRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            contentRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );

        gsap.fromTo(
            statsRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.4 }
        );
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: "url(/hero-bg.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(90deg, rgba(15,40,80,0.75), rgba(15,40,80,0.25))",
                }}
            />

            <Box
                ref={contentRef}
                sx={{
                    position: "relative",
                    zIndex: 2,
                    maxWidth: 1200,
                    mx: "auto",
                    px: 4,
                    pt: { xs: 10, md: 16 },
                    color: "white",
                }}
            >
                <Box
                    sx={{
                        maxWidth: 820,
                        left: 0,
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(18px)",
                        borderRadius: "24px",
                        p: { xs: 4, md: 5 },
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            lineHeight: 1.2,
                        }}
                    >
                        Bridging language gaps
                        between doctors and patients.
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 16,
                            opacity: 0.95,
                            lineHeight: 1.7,
                            mb: 4,
                        }}
                    >
                        A real-time medical translation platform designed for seamless
                        doctor–patient communication. Enable accurate multilingual
                        conversations using live text translation, audio messages,
                        and AI-generated medical summaries — all in one secure interface.
                    </Typography>

                    <Button
                        size="large"
                        onClick={() => navigate("/chat")}
                        sx={{
                            px: 5,
                            py: 1.4,
                            borderRadius: "30px",
                            backgroundColor: "#4f9cf9",
                            fontWeight: 700,
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#3b82f6",
                            },
                        }}
                    >
                        Start Consultation
                    </Button>
                </Box>

                <Box
                    ref={statsRef}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr 1fr",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 4,
                        mt: 6,
                        maxWidth: 800,
                    }}
                >
                    {[
                        { value: "20+", label: "Years of Experience" },
                        { value: "95%", label: "Patient Satisfaction" },
                        { value: "5000+", label: "Patients Served" },
                        { value: "10+", label: "Healthcare Providers" },
                    ].map((item, i) => (
                        <Box key={i}>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {item.value}
                            </Typography>
                            <Typography sx={{ opacity: 0.85 }}>
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}


