#!/usr/bin/env python3

from infra.facelivenessbackend.topology import FaceLiveness
from infra.frontend.cognito.topology import FaceLivenessCognito
from infra.interfaces import IRflStack
from constructs import Construct
from aws_cdk import CfnOutput


class DefaultRflStack(IRflStack):
  '''
  Represents the simple deployment environment for Rfl.

  The upstream sample also provisioned a CodeCommit repo plus an Amplify
  hosted copy of the frontend. CodeCommit is no longer available to new
  AWS accounts and the frontend is run locally here, so that part is
  dropped and the values the local frontend needs are exported instead.
  '''
  def __init__(self, scope:Construct, id:str, rfl_stack_name:str, **kwargs)->None:
    self.__zone_name = rfl_stack_name
    super().__init__(scope, id, **kwargs)

    assert self.rfl_stack_name is not None

    # Backend: two Lambdas behind API Gateway
    faceliveness = FaceLiveness(self,'FaceLiveness', rfl_stack=self)

    # Cognito user pool / identity pool used by the Amplify liveness component
    cognito = FaceLivenessCognito(self,"RflCognito",rfl_stack=self )

    CfnOutput(self, "ApiUrl", value=faceliveness.api_gateway.rest_api_url())
    CfnOutput(self, "IdentityPoolId", value=cognito.idp.ref)
    CfnOutput(self, "UserPoolId", value=cognito.cognito.user_pool_id)
    CfnOutput(self, "WebClientId", value=cognito.client.user_pool_client_id)

  @property
  def rfl_stack_name(self)->str:
    return self.__zone_name
