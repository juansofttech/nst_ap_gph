import { gql, useSubscription } from '@apollo/client';

// TCK-SUBSCRIPTIONS:[RM-USR-098735] P+ 10%
// Reusable Module
export const createGraphQLSubscription = (subscriptionQuery: string, onData: (data: any) => void) => {
    const SUBSCRIPTION = gql`${subscriptionQuery}`;

    const { data, loading, error } = useSubscription(SUBSCRIPTION);

    if (loading) return { loading: true };
    if (error) {
        console.error('Subscription error:', error);
        return { error };
    }

    if (data) {
        onData(data);
    }

    return { data };
};