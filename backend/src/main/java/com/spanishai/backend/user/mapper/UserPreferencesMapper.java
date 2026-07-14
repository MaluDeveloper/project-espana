package com.spanishai.backend.user.mapper;

import com.spanishai.backend.user.dto.UserPreferencesResponse;
import com.spanishai.backend.user.dto.UserPreferencesUpdateRequest;
import com.spanishai.backend.user.entity.UserPreferences;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserPreferencesMapper {

    UserPreferencesResponse toResponse(UserPreferences preferences);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UserPreferencesUpdateRequest request, @MappingTarget UserPreferences preferences);
}
