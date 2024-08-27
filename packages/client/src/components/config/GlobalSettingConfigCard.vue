<template>
    <form>
        <div class="row mb-3">
            <label :for="'settingValue' + settingId" class="col-form-label col-sm-2">{{displayName}}</label>
            <div class="col-sm-10">
                <div class="input-group">
                    <input type="text" :class="'form-control border-' + borderVarient" :id="'settingValue' + settingId" v-model="settingValue" :disabled="settingId === null || !isLoading()">
                    <button class="btn btn-info" type="button" v-popover title="ID" :data-bs-content="settingId"><i class="bi bi-info-circle"></i></button>
                    <button class="btn btn-success" type="button" @click="saveClick()"><i class="bi bi-save"></i></button>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import {useToast} from 'vue-toast-notification'
const toast = useToast()

const props = defineProps({
    name: String,
    settingObj: {
        type: Object,
        required: false
    },
    displayName: String
})

const settingId = computed(() => {
    if (props.settingObj.value)
        return props.settingObj.value._id
    else 
        return ''
})

const settingValue = ref('')

watch(props.settingObj, (newSettingObj) => {
    settingValue.value = newSettingObj.value
})

const borderVarient = ref('default')

const { mutate: updateGlobalSetting, loading: updateLoading, onDone: onUpdateDone, onError: onUpdateError } = useMutation(gql`
mutation GlobalSettingUpdateById($id: MongoID!, $record: UpdateByIdGlobalSettingInput!) {
    globalSettingUpdateById(_id: $id, record: $record) {
        error {
            message
        }
    }
}`)

onUpdateDone(() => {
    setBorderVarient('success')
    toast.success('Successfully saved the global setting')
})

onUpdateError((error) => {
    toast.error('Error saving the global setting')
    console.error(error)
})

// const { mutate: deleteGlobalSetting, loading: removeLoading, onError: onDeleteError } = useMutation(gql`
// mutation GlobalSettingRemoveById($id: MongoID!) {
//     globalSettingRemoveById(_id: $id) {
//         error {
//             message
//         }
//     }
// }`)

// onDeleteError((error) => {
//     toast.danger('Error deleting the global setting')
//     console.error(error)
// })

function isLoading() {
    return updateLoading
}

function saveClick() {
    updateGlobalSetting({
        id: props.settingObj.value._id,
        record: {
            value: settingValue.value
        }
    })
}

// function deleteClick() {
//     deleteGlobalSetting({
//         id: props.settingId
//     })
// }

function setBorderVarient(varient, timeout) {
    borderVarient.value = varient
    setTimeout(() => {
        borderVarient.value = 'default'
    }, timeout ?? 1000)
}
</script>