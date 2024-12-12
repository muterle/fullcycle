import { Test, TestingModule } from '@nestjs/testing';
import { RoutesDriveService } from './routes-driver.service';

describe('RoutesDriveService', () => {
  let service: RoutesDriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutesDriveService],
    }).compile();

    service = module.get<RoutesDriveService>(RoutesDriveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
