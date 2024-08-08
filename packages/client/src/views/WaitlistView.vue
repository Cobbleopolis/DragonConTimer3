<template>
    <div class="container pt-2">
        <template v-if="!isLoading">
            <WaitlistEntryComponent v-for="entry in waitlistEntries" :key="entry._id" :waitlistEntry="entry" :consoleList="consoles" />
        </template>
        <template v-else>
            <div class="d-flex justify-content-center">
                <LoadingAnimation />
            </div>
        </template>
    </div>
</template>

<script setup>
import { useQuery, useQueryLoading } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import LoadingAnimation from '../components/LoadingAnimation.vue'
import { computed } from 'vue'
import UseUpdateQuery from '../useables/UseUpdateQuery'
import WaitlistEntryComponent from '../components/WaitlistEntryComponent.vue'

const isLoading = useQueryLoading()

function dateSort(a, b) {
    return new Date(a.waitingTimestamp) - new Date(b.waitingTimestamp)
}

const waitlistEntryQuery = useQuery(gql`
query WaitlistEntry($sort: SortFindManyWaitlistEntryInput) {
  waitlistEntry(sort: $sort) {
    _id
    notes
    playerName
    waitingConsole
    waitingGame
    waitingTimestamp
  }
}`, {
    sort: 'WAITINGTIMESTAMP_ASC'
})

waitlistEntryQuery.subscribeToMore({
    document: gql`
    subscription WaitlistEntryCreate {
        waitlistEntryCreate {
            _id
            notes
            playerName
            waitingConsole
            waitingGame
            waitingTimestamp
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionCreateUpdateQuery('waitlistEntry', 'waitlistEntryCreate', dateSort)
})

waitlistEntryQuery.subscribeToMore({
    document: gql`
    subscription WaitlistEntryUpdate {
        waitlistEntryUpdate {
            _id
            notes
            playerName
            waitingConsole
            waitingGame
            waitingTimestamp
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionUpdateUpdateQuery('waitlistEntry', 'waitlistEntryUpdate', dateSort)
})

waitlistEntryQuery.subscribeToMore({
    document: gql`
    subscription WaitlistEntryRemove {
        waitlistEntryRemove {
            _id
            notes
            playerName
            waitingConsole
            waitingGame
            waitingTimestamp
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionRemoveUpdateQuery('waitlistEntry', 'waitlistEntryRemove', dateSort)
})

const waitlistEntries = computed(() => waitlistEntryQuery.result.value?.waitlistEntry ?? [] )


const consoleReq = useQuery(gql`
query Console {
  console {
    _id
    name
  }
}`)

consoleReq.subscribeToMore({
    document: gql`
    subscription ConsoleUpdate {
        consoleUpdate {
            _id
            name
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionUpdateUpdateQuery('console', 'consoleUpdate')
})

consoleReq.subscribeToMore({
    document: gql`
    subscription ConsoleCreate {
        consoleCreate {
            _id
            name
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionCreateUpdateQuery('console', 'consoleCreate')
})

consoleReq.subscribeToMore({
    document: gql`
    subscription ConsoleRemove {
        consoleRemove {
            _id
            name
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionRemoveUpdateQuery('console', 'consoleRemove')
})

const consoles = computed(() => consoleReq.result.value?.console ?? [])


</script>