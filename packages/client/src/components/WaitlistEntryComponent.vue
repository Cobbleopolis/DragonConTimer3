<template>
    <div class="card mb-2">
        <div class="card-header">
            <b>{{ waitlistEntry.playerName }}</b>
        </div>
        <div class="card-body">
            <dl class="row mb-0">
                <dt class="col-sm-2">Time Waited</dt>
                <dd class="col-sm-10">{{ timeSinceTimestamp }}</dd>

                <dt class="col-sm-2" v-if="displayConsole">Console</dt>
                <dd class="col-sm-10" v-if="displayConsole">
                    <p v-for="console in waitingConsoleNames" :key="console" class="mb-0">{{ console }}</p>
                </dd>

                <dt class="col-sm-2" v-if="displayGame">Game</dt>
                <dd class="col-sm-10" v-if="displayGame">
                    <p v-for="game in waitlistEntry.waitingGame" :key="game" class="mb-0">{{ game }}</p>
                </dd>
            </dl>
        </div>
        <ul class="list-group list-group-flush" v-if="waitlistEntry.notes">
            <li class="list-group-item text-primary-emphasis bg-primary-subtle"><i class="bi bi-info-circle"></i> Notes: {{ waitlistEntry.notes }}</li>
        </ul>
        <div class="card-footer">
            <div class="btn-toolbar d-flex flex-wrap gap-2" role="toolbar" aria-label="Toolbar with button groups">
                <button class="btn btn-danger" @click="deleteEntry()"><i class="bi bi-trash"></i> Delete</button>
                <button class="btn btn-info" @click="showEditModal()"><i class="bi bi-pencil"></i> Set Fields</button>
            </div>
        </div>
        <WaitlistEntryFieldModal :waitlist-entry="waitlistEntry" :console-options="consoleList" ref="waitlistEntryFieldModal"/>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import moment from 'moment'
import timeUtils from '../utils/timeUtils'
import WaitlistEntryFieldModal from './modals/WaitlistEntryFieldModal.vue'

import {useToast} from 'vue-toast-notification'
const toast = useToast()

const props = defineProps({
    waitlistEntry: Object,
    consoleList: Array
})

const displayConsole = computed(() => props.waitlistEntry.waitingConsole.length > 0)

const displayGame = computed(() => props.waitlistEntry.waitingGame.length > 0)

const waitingConsoleNames = computed(() => props.waitlistEntry.waitingConsole.map(x => props.consoleList.find(c => c._id == x).name))

const waitlistEntryFieldModal = ref(null)

const { mutate: deleteQuery, onDone: onDeleteDone, onError: onDeleteError } = useMutation(gql`
mutation WaitlistEntryRemoveById($id: MongoID!) {
  waitlistEntryRemoveById(_id: $id) {
    recordId
  }
}`)

onDeleteDone(() => {
    toast.success('Entry deleted from waitlist!')
})

onDeleteError((error) => {
    toast.error('Error occured while attempting to delete entry from the waitlist!')
    console.error(error)
})

function deleteEntry() {
    deleteQuery({
        id: props.waitlistEntry._id
    })
}

function showEditModal() {
    waitlistEntryFieldModal.value.show({
        popFields: true,
        title: 'Update Waitlist Entry'
    })
}

function updateTick() {
    getFormattedTimeFromNow()
    // updateBorderVarient()
}

const timeSinceTimestamp = ref('')

function getFormattedTimeFromNow() {
    timeSinceTimestamp.value = timeUtils.formatDurationFormat(moment.duration(moment().diff(moment(props.waitlistEntry.waitingTimestamp))))
}

onMounted(() => {
    updateTick()
    setInterval(updateTick, 1000)  
})

onUnmounted(() => {
    clearInterval(updateTick)
})

</script>