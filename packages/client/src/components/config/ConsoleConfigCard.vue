<template>
    <div :class="'card border-' + borderVarient">
        <template v-if="!loading">
            <div :class="'card-header text-bg-' + borderVarient">
                <span>ID: {{ consoleObj._id }}</span>
            </div>
            <div class="card-body">
                <div class="mb-2">
                    <label :for="'consoleName' + consoleObj._id" class="form-label">Name</label>
                    <input type="text" class="form-control" :id="'consoleName' + consoleObj._id" v-model="formName">
                </div>
                <div class="d-flex flex-column flex-md-row gap-2">
                    <div class="flex-grow-1">
                        <label :for="'gameName' + consoleObj._id" class="form-label"><span>Games</span></label>
                        <div class="input-group mb-1" v-for="(game, i) in formGames" :key="consoleObj._id + i">
                            <input type="text" class="form-control" :id="'gameName' + consoleObj._id + i" v-model="game.name" placeholder="Game Name">
                            <input type="number" class="form-control" :id="'gameCount' + consoleObj._id + i" v-model="game.count" min="0">
                            <button class="btn btn-danger" type="button" :id="'buttonDeleteGame' + i" @click="deleteGame(i)"><i class="bi bi-trash"></i></button>
                        </div>
                        <div class="mb-2">
                            <button class="btn btn-primary" role="button" @click="addGame"><i class="bi bi-plus"></i> Add Game</button>
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <label :for="'extraName' + consoleObj._id" class="form-label"><span>Extras</span></label>
                        <div class="input-group mb-1" v-for="(extra, i) in formExtras" :key="consoleObj._id + i">
                            <input type="text" class="form-control" :id="'extraName' + consoleObj._id + i" v-model="extra.name" placeholder="Extra Name">
                            <input type="number" class="form-control" :id="'extraCount' + consoleObj._id + i" v-model="extra.count" min="0">
                            <button class="btn btn-danger" type="button" :id="'buttonDeleteExtra' + i" @click="deleteExtra(i)"><i class="bi bi-trash"></i></button>
                        </div>
                        <div class="mb-2">
                            <button class="btn btn-primary" role="button" @click="addExtra()"><i class="bi bi-plus"></i> Add Extra</button>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <label :for="'checkoutWarning' + consoleObj._id" class="form-label">Checkout Warning</label>
                    <input type="text" class="form-control" :id="'checkoutWarning' + consoleObj._id" v-model="formCheckoutWarning">
                </div>
                <div class="mb-4">
                    <label :for="'checkinWarning' + consoleObj._id" class="form-label">Checkout Warning</label>
                    <input type="text" class="form-control" :id="'checkinWarning' + consoleObj._id" v-model="formCheckinWarning">
                </div>
            </div>
            <div class="card-footer">
                <div class="btn-toolbar" role="toolbar" aria-label="Operation buttons for this console">
                    <div class="btn-group" role="group">
                        <button class="btn btn-success" @click="saveClick"><i class="bi bi-save"></i> Save</button>
                        <button class="btn btn-danger" @click="deleteClick"><i class="bi bi-trash"></i> Delete</button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="card-head">
                <span class="placeholder-glow">ID: <span class="placeholder col-2"></span></span>
            </div>
            <div class="card-body d-flex justify-content-center">
                <LoadingAnimation/>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryLoading } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import UseUpdateQuery from '../../useables/UseUpdateQuery'
import LoadingAnimation from '../../components/LoadingAnimation.vue'

import {useToast} from 'vue-toast-notification'
const toast = useToast()

const props = defineProps({
    consoleId: String
})

const loading = useQueryLoading()

const consoleReq = useQuery(gql`
query ConsoleById($id: MongoID!) {
    consoleById(_id: $id) {
        _id
        checkoutWarning
        checkinWarning
        games {
            count
            name
        }
        extras {
            _id
            count
            name
        }
        name
    }
}`, {
    id: props.consoleId
})

consoleReq.subscribeToMore({
    document: gql`
    subscription ConsoleUpdateById($recordId: MongoID!) {
        consoleUpdateById(recordId: $recordId) {
            _id
            checkoutWarning
            checkinWarning
            games {
                count
                name
            }
            extras {
                _id
                count
                name
            }
            name
        }
    }`,
    variables: {
        recordId: props.consoleId
    },
    updateQuery: UseUpdateQuery.standardUpdateUpdateQuery('consoleById', 'consoleUpdateById')
})

consoleReq.onResult((result) => {
    if (result.data) {
        formName.value = result.data.consoleById.name
        // eslint-disable-next-line no-unused-vars
        formGames.value = result.data.consoleById.games.map(({__typename, ...gameObj}) => gameObj)
        // eslint-disable-next-line no-unused-vars
        formExtras.value = result.data.consoleById.extras.map(({__typename, ...gameObj}) => gameObj)
        formCheckoutWarning.value = result.data.consoleById.checkoutWarning
        formCheckinWarning.value = result.data.consoleById.checkinWarning
    }
})

const consoleObj = computed(() => consoleReq.result.value?.consoleById ?? {})

const formName = ref(consoleObj.value.name)
const formGames = ref(consoleObj.value.games)
const formExtras = ref(consoleObj.value.extras)
const formCheckoutWarning = ref(consoleObj.value.checkoutWarning)
const formCheckinWarning = ref(consoleObj.value.checkinWarning)

const { mutate: updateConsole, onDone: onUpdateDone, onError: onUpdateError } = useMutation(gql`
mutation ConsoleUpdateById($id: MongoID!, $record: UpdateByIdConsoleInput!) {
    consoleUpdateById(_id: $id, record: $record) {
        error {
            message
        }
    }
}`)

onUpdateDone(() => {
    setBorderVarient('success')
    toast.success('Successfully saved the console')
})

onUpdateError((error) => {
    toast.error('Error saving the console')
    console.error(error)
})

const { mutate: deleteConsole, onError: onDeleteError } = useMutation(gql`
mutation ConsoleRemoveById($id: MongoID!) {
    consoleRemoveById(_id: $id) {
        error {
            message
        }
    }
}`)

onDeleteError((error) => {
    toast.error('Error deleting the console')
    console.error(error)
})

function saveClick() {
    updateConsole({
        id: props.consoleId,
        record: {
            name: formName.value,
            // eslint-disable-next-line no-unused-vars
            games: formGames.value.map(({__typename, ...gameObj}) => gameObj).sort((a, b) => {
                var textA = a.name.toUpperCase()
                var textB = b.name.toUpperCase()
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
            }),
            // eslint-disable-next-line no-unused-vars
            extras: formExtras.value.map(({__typename, ...gameObj}) => gameObj).sort((a, b) => {
                var textA = a.name.toUpperCase()
                var textB = b.name.toUpperCase()
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
            }),
            checkoutWarning: formCheckoutWarning.value,
            checkinWarning: formCheckinWarning.value
        }
    })
}

function deleteClick() {
    deleteConsole({
        id: props.consoleId
    })
}

const borderVarient = ref('default')

function setBorderVarient(varient, timeout) {
    borderVarient.value = varient
    setTimeout(() => {
        borderVarient.value = 'default'
    }, timeout ?? 1000)
}

function addGame() {
    formGames.value = [...formGames.value, {name: '', count: 1}]
}

function deleteGame(index) {
    formGames.value.splice(index, 1)
}

function addExtra() {
    formExtras.value = [...formExtras.value, {name: '', count: 1}]
}

function deleteExtra(index) {
    formExtras.value.splice(index, 1)
}
</script>