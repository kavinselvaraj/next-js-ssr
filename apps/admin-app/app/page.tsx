import { AppContainer, AppPageHeader, AppSection, MonorepoBadge } from '@skybridge/ui';

export default function AdminHomePage() {
    return (
        <AppContainer style={{ maxWidth: 960, margin: '3rem auto', padding: '0 1rem' }}>
            <AppPageHeader
                title="Admin App"
                subtitle="Welcome to the admin app."
            />
        </AppContainer>
    );
}
