package com.spanishai.backend.adapter.in.rest.mapper.user;

import com.spanishai.backend.adapter.in.rest.response.user.ProfileResponse;
import com.spanishai.backend.domain.model.Profile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileRestMapper {

    ProfileResponse toResponse(Profile profile);
}
