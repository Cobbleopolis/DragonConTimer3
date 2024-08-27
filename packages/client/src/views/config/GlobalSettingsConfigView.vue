<template>
    <main class="container pt-2 d-flex flex-column gap-3">
        <!-- <p v-for="setting in settingNames" :key="setting">{{ setting }}</p>
        <ConfigSettingConfig v-for="settingObj in globalSettings" :key="settingObj._id" :name="settingObj._id"/> -->
        <div class="card">
            <div class="card-header">
                General Settings
            </div>
            <div class="card-body">
                <ConfigSettingConfig :name="settings.appName.name" :setting-obj="settings.appName.settingObj" :display-name="settings.appName.displayName"/>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                Time Settings
            </div>
            <div class="card-body">
                <ConfigSettingConfig :name="settings.warnTime.name" :setting-obj="settings.warnTime.settingObj" :display-name="settings.warnTime.displayName"/>
                <ConfigSettingConfig :name="settings.kickTime.name" :setting-obj="settings.kickTime.settingObj" :display-name="settings.kickTime.displayName"/>
                <ConfigSettingConfig :name="settings.warnWaitlistTime.name" :setting-obj="settings.warnWaitlistTime.settingObj" :display-name="settings.warnWaitlistTime.displayName"/>
                <ConfigSettingConfig :name="settings.dangerWaitlistTime.name" :setting-obj="settings.dangerWaitlistTime.settingObj" :display-name="settings.dangerWaitlistTime.displayName"/>
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
import UseUpdateQuery from '../../useables/UseUpdateQuery'
const toast = useToast()

const settings = {
    appName: {
        name: 'appName',
        settingObj: ref(null),
        displayName: 'App Name'
    },
    kickTime: {
        name: 'kickTime',
        settingObj: ref(null),
        displayName: 'Kick Time'
    },
    warnTime: {
        name: 'warnTime',
        settingObj: ref(null),
        displayName: 'Warn Time'
    },
    warnWaitlistTime: {
        name: 'warnWaitlistTime',
        settingObj: ref(null),
        displayName: 'Warn Waitlist Time'
    },
    dangerWaitlistTime: {
        name: 'dangerWaitlistTime',
        settingObj: ref(null),
        displayName: 'Danger Waitlist Time'
    }
}

const allGlobalSettingLookup = useQuery(gql`
query GlobalSetting {
  globalSetting {
    _id
    name
    value
  }
}`)

allGlobalSettingLookup.onResult((result) => {
    if (result.data) {
        Object.keys(settings).forEach((key) => {
            let isFound = false
            for(const gs of result.data.globalSetting) {
                if (settings[key].name === gs.name) {
                    settings[key].settingObj.value = gs
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

allGlobalSettingLookup.subscribeToMore({
    document: gql`
    subscription GlobalSettingUpdate {
        globalSettingUpdate {
            _id
            name
            value
        }
    }`,
    updateQuery: UseUpdateQuery.standardCollectionUpdateUpdateQuery('globalSetting', 'globalSettingUpdate')
})

const { mutate: createGlobalSettingMutation, onDone: createGlobalSettingMutationDone, onError: createGlobalSettingMutationError } = useMutation(gql`
    mutation GlobalSettingCreate($record: CreateOneGlobalSettingInput!) {
        globalSettingCreate(record: $record) {
            record {
                _id
                name
                value
            }
        }
    }`)

createGlobalSettingMutationDone(result => {
    if (result.data) {
        const settingName = result.data.globalSettingCreate.record.name
        settings[settingName].settingObj.value = result.data.globalSettingCreate.record
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