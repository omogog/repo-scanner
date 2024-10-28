import { RepositoryDetailsHandler } from './RepositoryDetailsHandler';
import axios from 'axios';

export class FetchYAMLFileHandler extends RepositoryDetailsHandler {
    protected async process(request: RepositoryDetailsRequest): Promise<void> {
        const ymlFile = request.files?.find((file: any) => file.name.endsWith('.yml'));

        if (ymlFile && ymlFile.download_url) {
            try {
                const response = await axios.get(ymlFile.download_url);
                request.ymlFileContent = response.data;
            } catch (error) {
                console.error('Error fetching YAML file content:', error);
            }
        }
    }
}