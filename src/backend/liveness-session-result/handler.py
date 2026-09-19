import base64
import sys
from logging import Logger

import boto3

rek_client = boto3.client('rekognition')
logger = Logger(name='FaceLivenessLambdaFunction')


class FaceLivenessError(Exception):
    '''
    Represents an error due to Face Liveness Issue.
    '''
    pass


def encode_image(image):
    '''
    Rekognition hands images back as raw bytes, which will not survive being
    turned into JSON. Returns base64 text, or None when there is no image.
    '''
    if not image or not image.get('Bytes'):
        return None
    return base64.b64encode(image['Bytes']).decode('utf-8')


def get_session_results(session_id):
    '''
    Get Session result.
    '''
    try:
        response = rek_client.get_face_liveness_session_results(SessionId=session_id)
    except rek_client.exceptions.AccessDeniedException:
        logger.error('Access Denied Error')
        raise FaceLivenessError('AccessDeniedError')
    except rek_client.exceptions.InternalServerError:
        logger.error('InternalServerError')
        raise FaceLivenessError('InternalServerError')
    except rek_client.exceptions.InvalidParameterException:
        logger.error('InvalidParameterException')
        raise FaceLivenessError('InvalidParameterException')
    except rek_client.exceptions.SessionNotFoundException:
        logger.error('SessionNotFound')
        raise FaceLivenessError('SessionNotFound')
    except rek_client.exceptions.ThrottlingException:
        logger.error('ThrottlingException')
        raise FaceLivenessError('ThrottlingException')
    except rek_client.exceptions.ProvisionedThroughputExceededException:
        logger.error('ProvisionedThroughputExceededException')
        raise FaceLivenessError('ProvisionedThroughputExceededException')

    # A session that failed the check, or has not finished yet, comes back
    # with no reference image at all, so everything here stays optional.
    # Audit images are deliberately left out: nothing in the UI uses them and
    # they make the response several times larger.
    result = {
        'SessionId': response.get('SessionId', session_id),
        'Status': response.get('Status'),
        'Confidence': response.get('Confidence'),
    }

    reference_image = encode_image(response.get('ReferenceImage'))
    if reference_image is not None:
        result['ReferenceImage'] = {'Bytes': reference_image}

    return result


def lambda_handler(event, context):
    output = get_session_results(event['sessionid'])
    return {
        'statusCode': 200,
        'body': output
    }


if __name__ == "__main__":
    session_id = sys.argv[1]
    status = get_session_results(session_id)
