export const getActivities = (req, res) => {
    // In a real application, this data would come from a 'Activities' collection in your database.
    const activityData = {
        items: [
            { id: '1', message: 'Please, sign the agreement for the loan application', timestamp: 'Nov 29, 20:48', actionType: 'sign' },
            { id: '2', message: 'Please, provide an additional information for the loan application', timestamp: 'Nov 29, 20:48', actionType: 'add-info' },
        ],
    };
    res.json(activityData.items);
};