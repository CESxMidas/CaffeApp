import { Global, Module } from '@nestjs/common';
import { ActorResolverService } from './actor-resolver.service';
import { AuditService } from './audit.service';

@Global()
@Module({
  providers: [AuditService, ActorResolverService],
  exports: [AuditService, ActorResolverService],
})
export class AuditModule {}
