<template>
    <main class="container pt-2 d-flex flex-column gap-3">
        <!-- <p v-for="setting in settingNames" :key="setting">{{ setting }}</p>
        <ConfigSettingConfig v-for="settingObj in globalSettings" :key="settingObj._id" :name="settingObj._id"/> -->
        <div class="card">
            <div class="card-header">
                Time Settings
            </div>
            <div class="card-body">

                <ConfigSettingConfig :name="settings.warnTime.name" :setting-id="settings.warnTime.id" :display-name="settings.warnTime.displayName"/>
                <ConfigSettingConfig :name="settings.kickTime.name" :setting-id="settings.kickTime.id" :display-name="settings.kickTime.displayName"/>
                <ConfigSettingConfig :name="settings.warnWaitlistTime.name" :setting-id="settings.warnWaitlistTime.id" :display-name="settings.warnWaitlistTime.displayName"/>
                <ConfigSettingConfig :name="settings.dangerWaitlistTime.name" :setting-id="settings.dangerWaitlistTime.id" :display-name="settings.dangerWaitlistTime.displayName"/>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ConfigSettingConfig from '../../components/config/GlobalSettingConfigCard.vue'

import {useToast} from 'vue-toast-notification'
const toast = useToast()

const settings = {
    kickTime: {
        name: 'kickTime',
        id: ref(null),
        displayName: 'Kick Time'
    },
    warnTime: {
        name: 'warnTime',
        id: ref(null),
        displayName: 'Warn Time'
    },
    warnWaitlistTime: {
        name: 'warnWaitlistTime',
        id: ref(null),
        displayName: 'Warn Waitlist Time'
    },
    dangerWaitlistTime: {
        name: 'dangerWaitlistTime',
        id: ref(null),
        displayName: 'Danger Waitlist Time'
    }
}

const idLookupQuery = useQuery(gql`
query GlobalSetting {
  globalSetting {
    _id
    name
  }
}`)

idLookupQuery.onResult((result) => {
    if (result.data) {
        Object.keys(settings).forEach((key) => {
            let isFound = false
            for(const gs of result.data.globalSetting) {
                if (settings[key].name === gs.name) {
                    settings[key].id.value = gs._id
                    isFound = true
                    break
                }
            }
            if (!isFound) {
                createGlobalSetting(settings[key].name)
            }
        })
    }
})

let { mutate: createGlobalSettingMutation, onDone: createGlobalSettingMutationDone, onError: createGlobalSettingMutationError } = useMutation(gql`
    mutation GlobalSettingCreate($record: CreateOneGlobalSettingInput!) {
        globalSettingCreate(record: $record) {
            record {
                name
            }
            recordId
        }
    }`)

createGlobalSettingMutationDone(result => {
    if (result.data) {
        const settingName = result.data.record.name
        settings[settingName].id.value = result.data.recordId
    }
})

createGlobalSettingMutationError((error) => {
    toast.error('Error creating a new console')
    console.error(error)
})

function createGlobalSetting(name) {
    createGlobalSettingMutation({
        record: {
            name
        }
    })
}
</script>