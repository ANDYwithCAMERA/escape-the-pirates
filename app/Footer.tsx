import React from 'react';
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"></link>
const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        Built by{' '}
        <a
          href="https://andydoyle.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Andy
        </a>
      </p>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    background: '#ffffff',
    color: '#555',
    fontFamily: "'Poppins', sans-serif",
    position: 'fixed',
    bottom: 0,
    width: '100%',
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 100,
  },
  text: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '0.3rem',
    borderBottom: '2px solid rgba(255, 255, 255, 0.7)',
    transition: 'color 0.3s, border-color 0.3s',
  },
};

// Add animation via inline @keyframes
if (typeof window !== 'undefined' && document.styleSheets.length > 0) {
  const sheet = document.styleSheets[0] as CSSStyleSheet;
  sheet.insertRule(
    `@keyframes sparkle {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }`,
    sheet.cssRules.length
  );
}

export default Footer;
