<template>
    <nav class="navbar navbar-expand-lg bg-body-secondary">
        <div class="container-fluid">
            <a class="navbar-brand">
                <img src="/favicon.png" width="30" height="30">
            </a>
            <a class="navbar-brand">Dragon Con Timer<span v-if="hasAppName">: {{ appName.value }}</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/availability">Availability</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/waitlist">Waitlist</RouterLink>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Config
                        </a>
                        <ul class="dropdown-menu m-0">
                            <li>
                                <RouterLink class="dropdown-item" to="/config/globalSettings">Global Settings</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/config/consoles">Consoles</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/config/stations">Stations</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Themes
                        </a>
                        <ThemeSwitcher />
                    </li>
                </ul>
                <span class="navbar-text">
                    {{ common.buildinfo.version }}
                </span>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue'
// eslint-disable-next-line no-unused-vars
import { RouterLink } from 'vue-router'
// eslint-disable-next-line no-unused-vars
import ThemeSwitcher from './ThemeSwitcher.vue'
import common from '@dct/common'

import UseGlobalSettings from '../useables/UseGlobalSettings'

const { getSetting } = UseGlobalSettings()
const appName = getSetting('appName')
const hasAppName = computed(() => appName.value && appName.value.value)
</script>