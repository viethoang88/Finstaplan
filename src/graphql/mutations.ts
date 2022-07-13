/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPreassessment = /* GraphQL */ `
  mutation CreatePreassessment(
    $input: CreatePreassessmentInput!
    $condition: ModelPreassessmentConditionInput
  ) {
    createPreassessment(input: $input, condition: $condition) {
      id
      advisorId
      clientId
      advisorName
      dealerGroup
      clientName
      dob
      gender
      healthInfo
      preassessmentData
      attachments
      underwriters {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      underwriterIDs
      createdAt
      updatedAt
    }
  }
`;
export const updatePreassessment = /* GraphQL */ `
  mutation UpdatePreassessment(
    $input: UpdatePreassessmentInput!
    $condition: ModelPreassessmentConditionInput
  ) {
    updatePreassessment(input: $input, condition: $condition) {
      id
      advisorId
      clientId
      advisorName
      dealerGroup
      clientName
      dob
      gender
      healthInfo
      preassessmentData
      attachments
      underwriters {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      underwriterIDs
      createdAt
      updatedAt
    }
  }
`;
export const deletePreassessment = /* GraphQL */ `
  mutation DeletePreassessment(
    $input: DeletePreassessmentInput!
    $condition: ModelPreassessmentConditionInput
  ) {
    deletePreassessment(input: $input, condition: $condition) {
      id
      advisorId
      clientId
      advisorName
      dealerGroup
      clientName
      dob
      gender
      healthInfo
      preassessmentData
      attachments
      underwriters {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      underwriterIDs
      createdAt
      updatedAt
    }
  }
`;
export const createPreassessmentResponse = /* GraphQL */ `
  mutation CreatePreassessmentResponse(
    $input: CreatePreassessmentResponseInput!
    $condition: ModelPreassessmentResponseConditionInput
  ) {
    createPreassessmentResponse(input: $input, condition: $condition) {
      id
      underwriterID
      clientID
      clientFullName
      underwriterFullName
      underwriterCompany
      advisorID
      preassessmentID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      response
      createdAt
      updatedAt
    }
  }
`;
export const updatePreassessmentResponse = /* GraphQL */ `
  mutation UpdatePreassessmentResponse(
    $input: UpdatePreassessmentResponseInput!
    $condition: ModelPreassessmentResponseConditionInput
  ) {
    updatePreassessmentResponse(input: $input, condition: $condition) {
      id
      underwriterID
      clientID
      clientFullName
      underwriterFullName
      underwriterCompany
      advisorID
      preassessmentID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      response
      createdAt
      updatedAt
    }
  }
`;
export const deletePreassessmentResponse = /* GraphQL */ `
  mutation DeletePreassessmentResponse(
    $input: DeletePreassessmentResponseInput!
    $condition: ModelPreassessmentResponseConditionInput
  ) {
    deletePreassessmentResponse(input: $input, condition: $condition) {
      id
      underwriterID
      clientID
      clientFullName
      underwriterFullName
      underwriterCompany
      advisorID
      preassessmentID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      response
      createdAt
      updatedAt
    }
  }
`;
export const createPreassessmentResponseUnderwriterAdvisor = /* GraphQL */ `
  mutation CreatePreassessmentResponseUnderwriterAdvisor(
    $input: CreatePreassessmentResponseUnderwriterAdvisorInput!
    $condition: ModelPreassessmentResponseUnderwriterAdvisorConditionInput
  ) {
    createPreassessmentResponseUnderwriterAdvisor(
      input: $input
      condition: $condition
    ) {
      id
      clientID
      client {
        id
        advisorID
        advisor {
          id
          assumptions
          philosophies
          portfolios
          licenseeAllocations
          fixedBands
          benchmarkingProfile
          benchmarkingWeightings
          underwriters
          funds
          createdAt
          updatedAt
        }
        hasPartner
        hasDependents
        hasChildren
        hasJointDependents
        hasPartnerDependents
        goals
        values
        insuranceInfo
        riskProfile
        riskProfileScores
        primary {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        partner {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        advisors
        children {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        dependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        partnerDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        jointDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        authoritiesData
        healthInfo
        existingStructureDetails
        existingStructures
        createdAt
        updatedAt
      }
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      underwriterID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      preassessmentID
      preassessment {
        id
        advisorId
        clientId
        advisorName
        dealerGroup
        clientName
        dob
        gender
        healthInfo
        preassessmentData
        attachments
        underwriters {
          nextToken
        }
        underwriterIDs
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePreassessmentResponseUnderwriterAdvisor = /* GraphQL */ `
  mutation UpdatePreassessmentResponseUnderwriterAdvisor(
    $input: UpdatePreassessmentResponseUnderwriterAdvisorInput!
    $condition: ModelPreassessmentResponseUnderwriterAdvisorConditionInput
  ) {
    updatePreassessmentResponseUnderwriterAdvisor(
      input: $input
      condition: $condition
    ) {
      id
      clientID
      client {
        id
        advisorID
        advisor {
          id
          assumptions
          philosophies
          portfolios
          licenseeAllocations
          fixedBands
          benchmarkingProfile
          benchmarkingWeightings
          underwriters
          funds
          createdAt
          updatedAt
        }
        hasPartner
        hasDependents
        hasChildren
        hasJointDependents
        hasPartnerDependents
        goals
        values
        insuranceInfo
        riskProfile
        riskProfileScores
        primary {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        partner {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        advisors
        children {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        dependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        partnerDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        jointDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        authoritiesData
        healthInfo
        existingStructureDetails
        existingStructures
        createdAt
        updatedAt
      }
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      underwriterID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      preassessmentID
      preassessment {
        id
        advisorId
        clientId
        advisorName
        dealerGroup
        clientName
        dob
        gender
        healthInfo
        preassessmentData
        attachments
        underwriters {
          nextToken
        }
        underwriterIDs
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePreassessmentResponseUnderwriterAdvisor = /* GraphQL */ `
  mutation DeletePreassessmentResponseUnderwriterAdvisor(
    $input: DeletePreassessmentResponseUnderwriterAdvisorInput!
    $condition: ModelPreassessmentResponseUnderwriterAdvisorConditionInput
  ) {
    deletePreassessmentResponseUnderwriterAdvisor(
      input: $input
      condition: $condition
    ) {
      id
      clientID
      client {
        id
        advisorID
        advisor {
          id
          assumptions
          philosophies
          portfolios
          licenseeAllocations
          fixedBands
          benchmarkingProfile
          benchmarkingWeightings
          underwriters
          funds
          createdAt
          updatedAt
        }
        hasPartner
        hasDependents
        hasChildren
        hasJointDependents
        hasPartnerDependents
        goals
        values
        insuranceInfo
        riskProfile
        riskProfileScores
        primary {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        partner {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        advisors
        children {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        dependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        partnerDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        jointDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        authoritiesData
        healthInfo
        existingStructureDetails
        existingStructures
        createdAt
        updatedAt
      }
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      underwriterID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      preassessmentID
      preassessment {
        id
        advisorId
        clientId
        advisorName
        dealerGroup
        clientName
        dob
        gender
        healthInfo
        preassessmentData
        attachments
        underwriters {
          nextToken
        }
        underwriterIDs
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPreassessmentUnderwriter = /* GraphQL */ `
  mutation CreatePreassessmentUnderwriter(
    $input: CreatePreassessmentUnderwriterInput!
    $condition: ModelPreassessmentUnderwriterConditionInput
  ) {
    createPreassessmentUnderwriter(input: $input, condition: $condition) {
      id
      clientID
      advisorID
      underwriterID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      preassessmentID
      preassessment {
        id
        advisorId
        clientId
        advisorName
        dealerGroup
        clientName
        dob
        gender
        healthInfo
        preassessmentData
        attachments
        underwriters {
          nextToken
        }
        underwriterIDs
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePreassessmentUnderwriter = /* GraphQL */ `
  mutation UpdatePreassessmentUnderwriter(
    $input: UpdatePreassessmentUnderwriterInput!
    $condition: ModelPreassessmentUnderwriterConditionInput
  ) {
    updatePreassessmentUnderwriter(input: $input, condition: $condition) {
      id
      clientID
      advisorID
      underwriterID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      preassessmentID
      preassessment {
        id
        advisorId
        clientId
        advisorName
        dealerGroup
        clientName
        dob
        gender
        healthInfo
        preassessmentData
        attachments
        underwriters {
          nextToken
        }
        underwriterIDs
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePreassessmentUnderwriter = /* GraphQL */ `
  mutation DeletePreassessmentUnderwriter(
    $input: DeletePreassessmentUnderwriterInput!
    $condition: ModelPreassessmentUnderwriterConditionInput
  ) {
    deletePreassessmentUnderwriter(input: $input, condition: $condition) {
      id
      clientID
      advisorID
      underwriterID
      underwriter {
        id
        email
        password
        firstName
        lastName
        employerName
        businessNumber
        mobile
        phone
        status
        preassessments {
          nextToken
        }
        preassessmentResponses {
          nextToken
        }
        createdAt
        updatedAt
      }
      preassessmentID
      preassessment {
        id
        advisorId
        clientId
        advisorName
        dealerGroup
        clientName
        dob
        gender
        healthInfo
        preassessmentData
        attachments
        underwriters {
          nextToken
        }
        underwriterIDs
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createUnderwriter = /* GraphQL */ `
  mutation CreateUnderwriter(
    $input: CreateUnderwriterInput!
    $condition: ModelUnderwriterConditionInput
  ) {
    createUnderwriter(input: $input, condition: $condition) {
      id
      email
      password
      firstName
      lastName
      employerName
      businessNumber
      mobile
      phone
      status
      preassessments {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      preassessmentResponses {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUnderwriter = /* GraphQL */ `
  mutation UpdateUnderwriter(
    $input: UpdateUnderwriterInput!
    $condition: ModelUnderwriterConditionInput
  ) {
    updateUnderwriter(input: $input, condition: $condition) {
      id
      email
      password
      firstName
      lastName
      employerName
      businessNumber
      mobile
      phone
      status
      preassessments {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      preassessmentResponses {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUnderwriter = /* GraphQL */ `
  mutation DeleteUnderwriter(
    $input: DeleteUnderwriterInput!
    $condition: ModelUnderwriterConditionInput
  ) {
    deleteUnderwriter(input: $input, condition: $condition) {
      id
      email
      password
      firstName
      lastName
      employerName
      businessNumber
      mobile
      phone
      status
      preassessments {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      preassessmentResponses {
        items {
          id
          clientID
          advisorID
          underwriterID
          preassessmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createAdvisor = /* GraphQL */ `
  mutation CreateAdvisor(
    $input: CreateAdvisorInput!
    $condition: ModelAdvisorConditionInput
  ) {
    createAdvisor(input: $input, condition: $condition) {
      id
      clients {
        items {
          id
          clientID
          advisorID
          createdAt
          updatedAt
        }
        nextToken
      }
      advisorProfile {
        email
        mobile
        phone
        firstName
        lastName
        logo
        profilePicture
        addressOne
        addressTwo
        city
        state
        country
        currency
        employerName
        businessNumber
        dealerGroup
        dealerGroupNumber
      }
      assumptions
      philosophies
      portfolios
      licenseeAllocations
      fixedBands
      benchmarkingProfile
      benchmarkingWeightings
      underwriters
      funds
      createdAt
      updatedAt
    }
  }
`;
export const updateAdvisor = /* GraphQL */ `
  mutation UpdateAdvisor(
    $input: UpdateAdvisorInput!
    $condition: ModelAdvisorConditionInput
  ) {
    updateAdvisor(input: $input, condition: $condition) {
      id
      clients {
        items {
          id
          clientID
          advisorID
          createdAt
          updatedAt
        }
        nextToken
      }
      advisorProfile {
        email
        mobile
        phone
        firstName
        lastName
        logo
        profilePicture
        addressOne
        addressTwo
        city
        state
        country
        currency
        employerName
        businessNumber
        dealerGroup
        dealerGroupNumber
      }
      assumptions
      philosophies
      portfolios
      licenseeAllocations
      fixedBands
      benchmarkingProfile
      benchmarkingWeightings
      underwriters
      funds
      createdAt
      updatedAt
    }
  }
`;
export const deleteAdvisor = /* GraphQL */ `
  mutation DeleteAdvisor(
    $input: DeleteAdvisorInput!
    $condition: ModelAdvisorConditionInput
  ) {
    deleteAdvisor(input: $input, condition: $condition) {
      id
      clients {
        items {
          id
          clientID
          advisorID
          createdAt
          updatedAt
        }
        nextToken
      }
      advisorProfile {
        email
        mobile
        phone
        firstName
        lastName
        logo
        profilePicture
        addressOne
        addressTwo
        city
        state
        country
        currency
        employerName
        businessNumber
        dealerGroup
        dealerGroupNumber
      }
      assumptions
      philosophies
      portfolios
      licenseeAllocations
      fixedBands
      benchmarkingProfile
      benchmarkingWeightings
      underwriters
      funds
      createdAt
      updatedAt
    }
  }
`;
export const createAdvisorClient = /* GraphQL */ `
  mutation CreateAdvisorClient(
    $input: CreateAdvisorClientInput!
    $condition: ModelAdvisorClientConditionInput
  ) {
    createAdvisorClient(input: $input, condition: $condition) {
      id
      clientID
      client {
        id
        advisorID
        advisor {
          id
          assumptions
          philosophies
          portfolios
          licenseeAllocations
          fixedBands
          benchmarkingProfile
          benchmarkingWeightings
          underwriters
          funds
          createdAt
          updatedAt
        }
        hasPartner
        hasDependents
        hasChildren
        hasJointDependents
        hasPartnerDependents
        goals
        values
        insuranceInfo
        riskProfile
        riskProfileScores
        primary {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        partner {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        advisors
        children {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        dependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        partnerDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        jointDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        authoritiesData
        healthInfo
        existingStructureDetails
        existingStructures
        createdAt
        updatedAt
      }
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateAdvisorClient = /* GraphQL */ `
  mutation UpdateAdvisorClient(
    $input: UpdateAdvisorClientInput!
    $condition: ModelAdvisorClientConditionInput
  ) {
    updateAdvisorClient(input: $input, condition: $condition) {
      id
      clientID
      client {
        id
        advisorID
        advisor {
          id
          assumptions
          philosophies
          portfolios
          licenseeAllocations
          fixedBands
          benchmarkingProfile
          benchmarkingWeightings
          underwriters
          funds
          createdAt
          updatedAt
        }
        hasPartner
        hasDependents
        hasChildren
        hasJointDependents
        hasPartnerDependents
        goals
        values
        insuranceInfo
        riskProfile
        riskProfileScores
        primary {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        partner {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        advisors
        children {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        dependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        partnerDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        jointDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        authoritiesData
        healthInfo
        existingStructureDetails
        existingStructures
        createdAt
        updatedAt
      }
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteAdvisorClient = /* GraphQL */ `
  mutation DeleteAdvisorClient(
    $input: DeleteAdvisorClientInput!
    $condition: ModelAdvisorClientConditionInput
  ) {
    deleteAdvisorClient(input: $input, condition: $condition) {
      id
      clientID
      client {
        id
        advisorID
        advisor {
          id
          assumptions
          philosophies
          portfolios
          licenseeAllocations
          fixedBands
          benchmarkingProfile
          benchmarkingWeightings
          underwriters
          funds
          createdAt
          updatedAt
        }
        hasPartner
        hasDependents
        hasChildren
        hasJointDependents
        hasPartnerDependents
        goals
        values
        insuranceInfo
        riskProfile
        riskProfileScores
        primary {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        partner {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          relationshipStatus
          employmentDetails
          contactDetails
          employed
          jobTitle
          jobIndustry
          employmentStatus
          employerName
          employmentStartDate
          desiredRetirementAge
          email
          mobile
          streetAddress
          streetAddress2
          city
          state
          zipCode
          existingStructures
          existingStructuresAndAdvisors
          wants
          whyMoney
          healthInfo
          authorities
          estatePlanning
          uiData
          preassessmentIDs
        }
        advisors
        children {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        dependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        partnerDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        jointDependents {
          firstName
          lastName
          dateOfBirth
          gender
          healthStatus
          uiData
          legacyNominee
          relatedTo
          studying
          studyingStatus
          studyingCompletionDate
          legacyAmount
        }
        authoritiesData
        healthInfo
        existingStructureDetails
        existingStructures
        createdAt
        updatedAt
      }
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createClient = /* GraphQL */ `
  mutation CreateClient(
    $input: CreateClientInput!
    $condition: ModelClientConditionInput
  ) {
    createClient(input: $input, condition: $condition) {
      id
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      hasPartner
      hasDependents
      hasChildren
      hasJointDependents
      hasPartnerDependents
      goals
      values
      insuranceInfo
      riskProfile
      riskProfileScores
      primary {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        relationshipStatus
        employmentDetails
        contactDetails
        employed
        jobTitle
        jobIndustry
        employmentStatus
        employerName
        employmentStartDate
        desiredRetirementAge
        email
        mobile
        streetAddress
        streetAddress2
        city
        state
        zipCode
        existingStructures
        existingStructuresAndAdvisors
        wants
        whyMoney
        healthInfo
        authorities
        estatePlanning
        uiData
        preassessmentIDs
      }
      partner {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        relationshipStatus
        employmentDetails
        contactDetails
        employed
        jobTitle
        jobIndustry
        employmentStatus
        employerName
        employmentStartDate
        desiredRetirementAge
        email
        mobile
        streetAddress
        streetAddress2
        city
        state
        zipCode
        existingStructures
        existingStructuresAndAdvisors
        wants
        whyMoney
        healthInfo
        authorities
        estatePlanning
        uiData
        preassessmentIDs
      }
      joint {
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
      }
      advisors
      children {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      dependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      partnerDependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      jointDependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      authoritiesData
      healthInfo
      existingStructureDetails
      existingStructures
      createdAt
      updatedAt
    }
  }
`;
export const updateClient = /* GraphQL */ `
  mutation UpdateClient(
    $input: UpdateClientInput!
    $condition: ModelClientConditionInput
  ) {
    updateClient(input: $input, condition: $condition) {
      id
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      hasPartner
      hasDependents
      hasChildren
      hasJointDependents
      hasPartnerDependents
      goals
      values
      insuranceInfo
      riskProfile
      riskProfileScores
      primary {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        relationshipStatus
        employmentDetails
        contactDetails
        employed
        jobTitle
        jobIndustry
        employmentStatus
        employerName
        employmentStartDate
        desiredRetirementAge
        email
        mobile
        streetAddress
        streetAddress2
        city
        state
        zipCode
        existingStructures
        existingStructuresAndAdvisors
        wants
        whyMoney
        healthInfo
        authorities
        estatePlanning
        uiData
        preassessmentIDs
      }
      partner {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        relationshipStatus
        employmentDetails
        contactDetails
        employed
        jobTitle
        jobIndustry
        employmentStatus
        employerName
        employmentStartDate
        desiredRetirementAge
        email
        mobile
        streetAddress
        streetAddress2
        city
        state
        zipCode
        existingStructures
        existingStructuresAndAdvisors
        wants
        whyMoney
        healthInfo
        authorities
        estatePlanning
        uiData
        preassessmentIDs
      }
      joint {
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
      }
      advisors
      children {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      dependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      partnerDependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      jointDependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      authoritiesData
      healthInfo
      existingStructureDetails
      existingStructures
      createdAt
      updatedAt
    }
  }
`;
export const deleteClient = /* GraphQL */ `
  mutation DeleteClient(
    $input: DeleteClientInput!
    $condition: ModelClientConditionInput
  ) {
    deleteClient(input: $input, condition: $condition) {
      id
      advisorID
      advisor {
        id
        clients {
          nextToken
        }
        advisorProfile {
          email
          mobile
          phone
          firstName
          lastName
          logo
          profilePicture
          addressOne
          addressTwo
          city
          state
          country
          currency
          employerName
          businessNumber
          dealerGroup
          dealerGroupNumber
        }
        assumptions
        philosophies
        portfolios
        licenseeAllocations
        fixedBands
        benchmarkingProfile
        benchmarkingWeightings
        underwriters
        funds
        createdAt
        updatedAt
      }
      hasPartner
      hasDependents
      hasChildren
      hasJointDependents
      hasPartnerDependents
      goals
      values
      insuranceInfo
      riskProfile
      riskProfileScores
      primary {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        relationshipStatus
        employmentDetails
        contactDetails
        employed
        jobTitle
        jobIndustry
        employmentStatus
        employerName
        employmentStartDate
        desiredRetirementAge
        email
        mobile
        streetAddress
        streetAddress2
        city
        state
        zipCode
        existingStructures
        existingStructuresAndAdvisors
        wants
        whyMoney
        healthInfo
        authorities
        estatePlanning
        uiData
        preassessmentIDs
      }
      partner {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        relationshipStatus
        employmentDetails
        contactDetails
        employed
        jobTitle
        jobIndustry
        employmentStatus
        employerName
        employmentStartDate
        desiredRetirementAge
        email
        mobile
        streetAddress
        streetAddress2
        city
        state
        zipCode
        existingStructures
        existingStructuresAndAdvisors
        wants
        whyMoney
        healthInfo
        authorities
        estatePlanning
        uiData
        preassessmentIDs
      }
      joint {
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
      }
      advisors
      children {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      dependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      partnerDependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      jointDependents {
        firstName
        lastName
        dateOfBirth
        gender
        expenses {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        liabilities {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        assets {
          id
          type
          parentType
          label
          value
          division
          notes
          icon
          bucket
        }
        incomes {
          id
          type
          parentType
          label
          value
          frequency
          division
          notes
          icon
          bucket
        }
        healthStatus
        uiData
        legacyNominee
        relatedTo
        studying
        studyingStatus
        studyingCompletionDate
        legacyAmount
      }
      authoritiesData
      healthInfo
      existingStructureDetails
      existingStructures
      createdAt
      updatedAt
    }
  }
`;
