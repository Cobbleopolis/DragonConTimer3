<template>
    <main class="container pt-2">
        <div v-if="!loading" class="d-flex flex-column gap-2 mb-2">
            <StationConfigCard v-for="station in stations" :key="station._id" :station-id="station._id"/>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="New Station Name" aria-label="New Station Name" aria-describedby="button-add" v-model="newStationName">
                <button class="btn btn-primary" type="button" id="button-add" @click="createNewConsole"><i class="bi bi-plus"></i> Add</button>
            </div>
        </div>
        <div v-else class="d-flex justify-content-center">
            <LoadingAnimation />
        </div>
    </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryLoading } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import UseUpdateQuery from '../../useables/UseUpdateQuery'
import LoadingAnimation from '../../components/LoadingAnimation.vue'
import stationStates from '../../utils/stationStates'
import StationConfigCard from '../../components/config/StationConfigCard.vue'

import {useToast} from 'vue-toast-notification'
const toast = useToast()

const loading = useQueryLoading()

const stationReq = useQuery(gql`
query Station {
    station {
        _id
    }
}`)

stationReq.subscribeToMore({
    document: gql`
    subscription StationCreate {
        stationCreate {
            _id
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionCreateUpdateQuery('station', 'stationCreate')
})

stationReq.subscribeToMore({
    document: gql`
    subscription StationRemove {
        stationRemove {
            _id
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionRemoveUpdateQuery('station', 'stationRemove')
})

const stations = computed(() => stationReq.result.value?.station ?? [])



const newStationName = ref('')

const { mutate: createConsole, onDone: createConsoleDone, onError: createConsoleError } = useMutation(gql`
mutation StationCreate($record: CreateOneStationInput!) {
  stationCreate(record: $record) {
    error {
      message
    }
  }
}`)

createConsoleDone(() => {
    newStationName.value = ''
})

createConsoleError((error) => {
    toast.error('Error creating a new station')
    console.error(error)
})

function createNewConsole() {
    createConsole({
        record: {
            name: newStationName.value,
            consoleOptions: [],
            status: stationStates.DEFAULT,
            orderPriority: 0
        }
    })
}
</script>