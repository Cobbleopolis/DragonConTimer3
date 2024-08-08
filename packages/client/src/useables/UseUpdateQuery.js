function standardCollectionCreateUpdateQuery(queryName, subscriptionName, sortCallback) {
    return (previousResult, { subscriptionData }) => {
        const tmp = structuredClone(previousResult)
        tmp[queryName] = [...tmp[queryName], subscriptionData.data[subscriptionName]]
        if (sortCallback) {
            tmp[queryName].sort(sortCallback)
        }
        return tmp
    }
}

function standardCollectionUpdateUpdateQuery(queryName, subscriptionName, sortCallback) {
    return (previousResult, { subscriptionData }) => {
        const tmp = structuredClone(previousResult)
        for (let i in tmp.station) {
            if (tmp[queryName][i]._id == subscriptionData.data[subscriptionName]._id) {
                tmp[queryName][i] = subscriptionData.data[subscriptionName]
                break
            }
        }
        if (sortCallback) {
            tmp[queryName].sort(sortCallback)
        }
        return tmp
    }
}

function standardCollectionRemoveUpdateQuery(queryName, subscriptionName, sortCallback) {
    return (previousResult, { subscriptionData }) => {
    //     if (subscriptionData.data[subscriptionName]) {
    //         const tmp = structuredClone(previousResult)
    //         let indexToRemove = -1
    //         for (let i = 0; i < tmp[queryName].length; i++) {
    //             if (tmp[queryName][i]._id === subscriptionData.data[subscriptionName]._id) {
    //                 indexToRemove = i
    //                 break
    //             }
    //         }
    //         if (indexToRemove !== -1) {
    //             tmp[queryName].splice(indexToRemove, 1)
    //         }
    //         return tmp
    //     }
        const tmp = structuredClone(previousResult)
        tmp[queryName] = tmp[queryName].filter(obj => obj._id !== subscriptionData.data[subscriptionName]._id)
        if (sortCallback) {
            tmp[queryName].sort(sortCallback)
        }
        return tmp
    }
}

function standardUpdateUpdateQuery(queryName, subscriptionName, sortCallback) {
    return (previousResult, { subscriptionData }) => {
        const tmp = structuredClone(previousResult)
        for (const key in subscriptionData.data[subscriptionName]) {
            tmp[queryName][key] = subscriptionData.data[subscriptionName][key]
        }
        if (sortCallback) {
            tmp[queryName].sort(sortCallback)
        }
        return tmp
    }
}

export default {
    standardCollectionCreateUpdateQuery,
    standardCollectionUpdateUpdateQuery,
    standardCollectionRemoveUpdateQuery,
    standardUpdateUpdateQuery
}