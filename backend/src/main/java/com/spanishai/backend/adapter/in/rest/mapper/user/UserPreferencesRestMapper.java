package com.spanishai.backend.adapter.in.rest.mapper.user;

import com.spanishai.backend.adapter.in.rest.response.user.UserPreferencesResponse;
import com.spanishai.backend.domain.model.UserPreferences;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserPreferencesRestMapper {

    UserPreferencesResponse toResponse(UserPreferences preferences);
}
