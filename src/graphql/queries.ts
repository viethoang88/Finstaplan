/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPreassessment = /* GraphQL */ `
  query GetPreassessment($id: ID!) {
    getPreassessment(id: $id) {
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
export const listPreassessments = /* GraphQL */ `
  query ListPreassessments(
    $filter: ModelPreassessmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPreassessments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getPreassessmentResponse = /* GraphQL */ `
  query GetPreassessmentResponse($id: ID!) {
    getPreassessmentResponse(id: $id) {
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
export const listPreassessmentResponses = /* GraphQL */ `
  query ListPreassessmentResponses(
    $id: ID
    $filter: ModelPreassessmentResponseFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPreassessmentResponses(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
          createdAt
          updatedAt
        }
        response
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUnderwriter = /* GraphQL */ `
  query GetUnderwriter($id: ID!) {
    getUnderwriter(id: $id) {
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
export const listUnderwriters = /* GraphQL */ `
  query ListUnderwriters(
    $id: ID
    $filter: ModelUnderwriterFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUnderwriters(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getAdvisor = /* GraphQL */ `
  query GetAdvisor($id: ID!) {
    getAdvisor(id: $id) {
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
export const listAdvisors = /* GraphQL */ `
  query ListAdvisors(
    $filter: ModelAdvisorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAdvisors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getClient = /* GraphQL */ `
  query GetClient($id: ID!) {
    getClient(id: $id) {
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
export const listClients = /* GraphQL */ `
  query ListClients(
    $filter: ModelClientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
