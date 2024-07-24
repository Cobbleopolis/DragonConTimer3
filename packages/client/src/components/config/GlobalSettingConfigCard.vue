<template>
    <form>
        <div class="row mb-3">
            <label :for="'settingValue' + props.settingId.value" class="col-form-label col-sm-2">{{displayName}}</label>
            <div class="col-sm-10">
                <div class="input-group">
                    <input type="text" :class="'form-control border-' + borderVarient" :id="'settingValue' + props.settingId.value" v-model="settingValue" :disabled="settingId === null || !isLoading()">
                    <button class="btn btn-info" type="button" v-popover title="ID" :data-bs-content="props.settingId"><i class="bi bi-info-circle"></i></button>
                    <button class="btn btn-success" type="button" @click="saveClick()"><i class="bi bi-save"></i></button>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import UseUpdateQuery from '../../useables/UseUpdateQuery'

import {useToast} from 'vue-toast-notification'
const toast = useToast()

const props = defineProps({
    name: String,
    settingId: Object,
    displayName: String
})

const isQueryEnabled = ref(props.settingId.value !== null)

const getGlobalSettingReq = useQuery(gql`
query GlobalSettingById($id: MongoID!) {
  globalSettingById(_id: $id) {
    _id
    name
    value
  }
}`,  {
    id: props.settingId
}, {
    enabled: isQueryEnabled
})

getGlobalSettingReq.onResult((result) => {
    if (result.data) {
        // settingName.value = result.data.globalSettingById.name
        settingValue.value = result.data.globalSettingById.value
    }
})

getGlobalSettingReq.onError((error) => {
    toast.error('Error saving the global setting')
    console.error(error)
})

const settingValue = ref('')

const borderVarient = ref('default')

watch(props.settingId, (newSettingId) => {
    if (newSettingId) {
        isQueryEnabled.value = true
        getGlobalSettingReq.subscribeToMore({
            document: gql`
            subscription GlobalSettingUpdateById($recordId: MongoID!) {
                globalSettingUpdateById(recordId: $recordId) {
                    _id
                    name
                    value
                }
            }`,
            variables: ref({
                recordId: newSettingId
            }),
            updateQuery: UseUpdateQuery.standardUpdateUpdateQuery('globalSettingById', 'globalSettingUpdateById')
        })
    }
})

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
        id: props.settingId.value,
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