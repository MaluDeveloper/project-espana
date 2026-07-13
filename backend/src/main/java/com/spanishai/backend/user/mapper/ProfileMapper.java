package com.spanishai.backend.user.mapper;

import com.spanishai.backend.user.dto.ProfileResponse;
import com.spanishai.backend.user.dto.ProfileUpdateRequest;
import com.spanishai.backend.user.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileResponse toResponse(Profile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(ProfileUpdateRequest request, @MappingTarget Profile profile);
}