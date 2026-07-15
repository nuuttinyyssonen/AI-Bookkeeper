'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CookieBanner() {
    const t = useTranslations('cookieBanner');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('cookie_notice_dismissed');
        if (!dismissed) setVisible(true);
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'white',
            borderTop: '1px solid #e2e8f0',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)',
        }}>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
                {t('text')}{' '}
                <a href="/privacy" style={{ color: '#0f766e', textDecoration: 'underline' }}>{t('privacyLink')}</a>
            </p>
            <button
                onClick={() => {
                    localStorage.setItem('cookie_notice_dismissed', 'true');
                    setVisible(false);
                }}
                style={{
                    flexShrink: 0,
                    height: '36px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                {t('accept')}
            </button>
        </div>
    );
}