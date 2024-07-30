<template>
    <div class="container pt-2">
        <template v-if="!isLoading">
            <p>WAITLIST PAGE</p>
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
import LoadingAnimation from '../components/LoadingAnimation.vue'

const isLoading = useQueryLoading()
</script>