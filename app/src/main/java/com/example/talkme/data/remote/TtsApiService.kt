package com.example.talkme.data.remote

import com.example.talkme.data.remote.model.CloudModelDto
import com.example.talkme.data.remote.model.CloudTtsSynthesizeRequest
import com.example.talkme.data.remote.model.CloudVoiceDto
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

/**
 * Retrofit REST API Contract for FastAPI Server-Side Voice AI Engine.
 */
interface TtsApiService {

    @GET("api/v1/tts/engines")
    suspend fun getEngines(): Response<List<String>>

    @GET("api/v1/tts/models")
    suspend fun getModels(): Response<List<CloudModelDto>>

    @GET("api/v1/tts/models/{modelId}")
    suspend fun getModelDetails(@Path("modelId") modelId: String): Response<CloudModelDto>

    @GET("api/v1/tts/voices")
    suspend fun getVoices(): Response<List<CloudVoiceDto>>

    @POST("api/v1/tts/synthesize")
    suspend fun synthesize(@Body request: CloudTtsSynthesizeRequest): Response<ResponseBody>
}
