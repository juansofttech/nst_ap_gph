// src/utils/subscriptionQueries.ts
export const USERS_DELETED_SUBSCRIPTION = `
    subscription {
        usersDeleted {
            id
            email
        }
    }
`;