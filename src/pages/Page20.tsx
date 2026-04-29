// @ts-nocheck
const GOLD = "#e8c96d";
const GOLDDIM = "#a07820";
const WHITE = "#d4c9a8";

const Sp = { minHeight: "100vh", background: "#000000", color: WHITE, fontFamily: "'Rajdhani',sans-serif", paddingBottom: 160, width: "100%", overflowX: "hidden" as const };

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page20({ onNavigate }: PageProps) {
  const pp = (txt: string) => <p style={{ color: WHITE, fontSize: 13, lineHeight: 1.85, marginBottom: 8 }}>{txt}</p>;
  const ss = (title: string, body: React.ReactNode) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: GOLD, fontWeight: 900, fontSize: 12, letterSpacing: 2, marginBottom: 6, borderBottom: `1px solid ${GOLDDIM}44`, paddingBottom: 4 }}>{title}</div>
      {body}
    </div>
  );

  return (
    <div style={{ ...Sp, padding: "30px 40px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 4, marginBottom: 4, fontWeight: 700 }}>LEGAL</div>
        <h1 style={{ fontFamily: "'Cinzel',serif", color: GOLD, fontSize: 26, fontWeight: 900, letterSpacing: 4, marginBottom: 4 }}>TERMS OF SERVICE & DISCLAIMER</h1>
        <div style={{ color: WHITE, fontSize: 11, marginBottom: 24, letterSpacing: 2 }}>EFFECTIVE MARCH 2026 · MANDASTRONG STUDIO LLC · mandastrongstudio2026.bolt.host</div>

        <div style={{ background: "#050505", border: `2px solid ${GOLD}`, padding: "22px 26px", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Cinzel',serif", color: GOLD, fontSize: 16, fontWeight: 900, letterSpacing: 3, marginBottom: 16, textAlign: "center" }}>TERMS OF SERVICE</div>
          {ss("1. ACCEPTANCE", <>{pp("By accessing or using MandaStrong Studio you agree to be legally bound by these Terms. If you do not agree, do not use this platform.")}</>)}
          {ss("2. SUBSCRIPTIONS & BILLING", <>{pp("Creator $20/mo · Pro $30/mo · Studio $50/mo. All plans auto-renew monthly. Studio includes 7-day free trial. All payments via Stripe. No refunds for partial periods.")}</>)}
          {ss("3. INTELLECTUAL PROPERTY", <>{pp("You retain full ownership of all original content. Studio Plan subscribers receive full commercial rights to AI-generated content. MandaStrong Studio and its codebase remain the intellectual property of Amanda Woolley and MandaStrong Studio LLC.")}</>)}
          {ss("4. ACCEPTABLE USE", <>{pp("Lawful use only. Prohibited: defamatory content, infringing IP, reverse-engineering the platform, spam, malware, or sharing credentials.")}</>)}
          {ss("5. SOCIAL MISSION", <>{pp("A meaningful portion of all subscription proceeds funds veterans mental health initiatives and school anti-bullying programmes.")}</>)}
          {ss("6. LIMITATION OF LIABILITY", <>{pp("Provided as-is. No liability for indirect or consequential damages. Total liability capped at amounts paid in the prior 30 days.")}</>)}
          <div style={{ borderTop: `1px solid ${GOLDDIM}`, paddingTop: 10, marginTop: 4 }}>
            <p style={{ color: GOLDDIM, fontSize: 11, margin: 0, letterSpacing: 1 }}>MANDASTRONG STUDIO LLC · AMANDA WOOLLEY · MARCH 2026 · MandaStrong1.Etsy.com</p>
          </div>
        </div>

        <div style={{ background: "#050505", border: `2px solid ${GOLD}`, padding: "22px 26px" }}>
          <div style={{ fontFamily: "'Cinzel',serif", color: GOLD, fontSize: 16, fontWeight: 900, letterSpacing: 3, marginBottom: 16, textAlign: "center" }}>DISCLAIMER</div>
          {ss("AI-GENERATED CONTENT", <>{pp("All outputs are generated algorithmically. Review all content before publication. You are solely responsible for fact-checking and compliance.")}</>)}
          {ss("NO PROFESSIONAL ADVICE", <>{pp("Nothing generated constitutes legal, medical, financial, or professional advice. Always consult a qualified professional.")}</>)}
          {ss("PLATFORM AVAILABILITY", <>{pp("Provided on an as-available basis. No guarantee of uninterrupted access or data retention. Back up all productions regularly.")}</>)}
          {ss("USER RESPONSIBILITY", <>{pp("All responsibility for how content is deployed, distributed, monetised, or shared rests entirely with the user.")}</>)}
          <div style={{ borderTop: `1px solid ${GOLDDIM}`, paddingTop: 10, marginTop: 4 }}>
            <p style={{ color: GOLDDIM, fontSize: 11, margin: 0, letterSpacing: 1 }}>— AMANDA WOOLLEY · FOUNDER · MANDASTRONG STUDIO LLC · MARCH 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
